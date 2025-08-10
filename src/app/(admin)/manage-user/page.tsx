'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { usersApi } from '@/lib/api/users.api';
import { User } from '@/store/auth.store';
import { UserStatus } from '@/types/user-status.type';

// New interface for student data from API
interface Student {
  id: number;
  username: string;
  name: string;
  status: string;
  photoUrl: string | null;
  total_score: number;
  solved: number;
}

interface StudentResponse {
  data: Student[];
  meta: {
    totalStudents: number;
  };
}

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  VERIFIED: 'bg-green-100 text-green-800',
  ACTIVE: 'bg-green-100 text-green-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-red-100 text-red-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800',
  BANNED: 'bg-red-100 text-red-800'
};

type TabType = 'solver' | 'creator';

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('solver');
  const [modal, setModal] = useState<{
    open: boolean;
    userId: number | null;
    action: 'ACTIVATE' | 'DEACTIVATE' | 'VERIFY' | null;
  }>({ open: false, userId: null, action: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof User | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination state for students
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const studentsPerPage = 20;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getUsers({});
      const users =
        (data as { users: { props: User }[] }).users?.map((u) => u.props) || [];
      setUsers(users);
    } catch {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (page: number = 1) => {
    setLoading(true);
    try {
      const skip = (page - 1) * studentsPerPage;
      const data = await usersApi.getStudent({
        skip,
        take: studentsPerPage,
        search: search || undefined
      });
      const response = data as StudentResponse;
      setStudents(response.data);
      setTotalStudents(response.meta.totalStudents);
    } catch {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users from API
  useEffect(() => {
    if (activeTab === 'creator') {
      fetchUsers();
    } else {
      fetchStudents(currentPage);
    }
  }, [activeTab, currentPage, search]);

  const handleSort = (key: keyof User) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortKey) return 0;
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (aValue == null || bValue == null) return 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  // Filter users based on active tab and other filters (only for teachers)
  const filteredUsers = sortedUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase());
    const matchesTab = user.role === 'TEACHER';
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    return matchesSearch && matchesTab && matchesStatus;
  });

  // Filter students based on status filter
  const filteredStudents = students.filter((student) => {
    const matchesStatus = statusFilter
      ? student.status === statusFilter ||
        (statusFilter === 'ACTIVE' && student.status === 'active') ||
        (statusFilter === 'INACTIVE' && student.status === 'inactive')
      : true;
    return matchesStatus;
  });

  const updateUserStatus = async (id: number, newStatus: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    try {
      await usersApi.updateUserStatus({
        username: user.username,
        status: newStatus
      });
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const updateStudentStatus = async (username: string, newStatus: string) => {
    try {
      await usersApi.updateUserStatus({
        username,
        status: newStatus
      });
      await fetchStudents(currentPage); // Refresh the list
    } catch (error) {
      console.error('Failed to update student status:', error);
    }
  };

  const handleActivateDeactivate = (
    userId: number,
    action: 'ACTIVATE' | 'DEACTIVATE' | 'VERIFY'
  ) => {
    setModal({ open: true, userId, action });
  };

  const confirmActivateDeactivateVerify = async () => {
    if (!modal.userId || !modal.action) return;

    let newStatus: string;
    switch (modal.action) {
      case 'ACTIVATE':
        newStatus = UserStatus.ACTIVE;
        break;
      case 'DEACTIVATE':
        newStatus = UserStatus.INACTIVE;
        break;
      case 'VERIFY':
        newStatus = UserStatus.ACTIVE;
        break;
      default:
        return;
    }

    if (activeTab === 'solver') {
      const student = students.find((s) => s.id === modal.userId);
      if (student) {
        await updateStudentStatus(student.username, newStatus);
      }
    } else {
      await updateUserStatus(modal.userId, newStatus);
    }
    cancelModal();
  };

  const cancelModal = () =>
    setModal({ open: false, userId: null, action: null });

  const totalPages = Math.ceil(totalStudents / studentsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-black" />
              <h1 className="text-2xl font-bold">Manage Users</h1>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('solver')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'solver'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Solver
            </button>
            <button
              onClick={() => setActiveTab('creator')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'creator'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Creator
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <input
              type="search"
              placeholder={`Search ${activeTab === 'solver' ? 'solvers' : 'creators'} by name or username...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex gap-2 w-full md:w-auto justify-end">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 h-10 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Aktif</option>
                <option value="INACTIVE">Tidak Aktif</option>
              </select>
            </div>
          </div>

          {loading && <div className="text-center py-4">Loading users...</div>}
          {error && (
            <div className="text-center text-red-500 py-2">{error}</div>
          )}

          {activeTab === 'solver' ? (
            // Students Table
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Avatar</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead className="text-center">Total Score</TableHead>
                    <TableHead className="text-center">Solved</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={student.photoUrl || '/placeholder-user.jpg'}
                            alt={student.name}
                          />
                          <AvatarFallback>
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.username}</TableCell>
                      <TableCell className="text-center">
                        {student.total_score}
                      </TableCell>
                      <TableCell className="text-center">
                        {student.solved}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[student.status as keyof typeof STATUS_COLORS]}`}
                        >
                          {student.status.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="space-x-2">
                        {(student.status === 'ACTIVE' ||
                          student.status === 'active') && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="min-w-[90px]"
                            onClick={() =>
                              handleActivateDeactivate(student.id, 'DEACTIVATE')
                            }
                          >
                            Deactivate
                          </Button>
                        )}
                        {(student.status === 'INACTIVE' ||
                          student.status === 'inactive') && (
                          <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white min-w-[90px]"
                            onClick={() =>
                              handleActivateDeactivate(student.id, 'ACTIVATE')
                            }
                          >
                            Activate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination for Students */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Showing {(currentPage - 1) * studentsPerPage + 1} to{' '}
                    {Math.min(currentPage * studentsPerPage, totalStudents)} of{' '}
                    {totalStudents} students
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 py-2 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {filteredStudents.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No students found.
                </div>
              )}
            </>
          ) : (
            // Teachers Table (unchanged)
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Avatar</TableHead>
                    <TableHead
                      onClick={() => handleSort('name')}
                      className="cursor-pointer select-none"
                    >
                      Name
                      {sortKey === 'name' &&
                        (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort('username')}
                      className="cursor-pointer select-none"
                    >
                      Username
                      {sortKey === 'username' &&
                        (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort('status')}
                      className="cursor-pointer select-none"
                    >
                      Status
                      {sortKey === 'status' &&
                        (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.photoUrl || '/placeholder-user.jpg'}
                            alt={user.name}
                          />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[user.status as keyof typeof STATUS_COLORS]}`}
                        >
                          {user.status.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="space-x-2">
                        {/* TEACHER: Not verified */}
                        {user.role === 'TEACHER' &&
                          user.verifiedAt === null && (
                            <Button
                              size="sm"
                              className="bg-green-400 hover:bg-green-500 text-black min-w-[90px]"
                              onClick={() =>
                                handleActivateDeactivate(user.id, 'VERIFY')
                              }
                            >
                              Verify
                            </Button>
                          )}
                        {/* TEACHER: Verified */}
                        {user.role === 'TEACHER' &&
                          user.verifiedAt !== null &&
                          user.status === UserStatus.ACTIVE && (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="min-w-[90px]"
                              onClick={() =>
                                handleActivateDeactivate(user.id, 'DEACTIVATE')
                              }
                            >
                              Deactivate
                            </Button>
                          )}
                        {user.role === 'TEACHER' &&
                          user.verifiedAt !== null &&
                          user.status === UserStatus.INACTIVE && (
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white min-w-[90px]"
                              onClick={() =>
                                handleActivateDeactivate(user.id, 'ACTIVATE')
                              }
                            >
                              Activate
                            </Button>
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredUsers.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No creators found.
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {/* Ban/Unban Confirmation Modal */}
      <Dialog open={modal.open} onOpenChange={cancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modal.action === 'ACTIVATE'
                ? 'Confirm Activate'
                : modal.action === 'DEACTIVATE'
                  ? 'Confirm Deactivate'
                  : 'Confirm Verify'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {modal.action === 'ACTIVATE'
              ? 'Are you sure you want to activate this user? They will be able to access the system.'
              : modal.action === 'DEACTIVATE'
                ? 'Are you sure you want to deactivate this user? They will not be able to access the system.'
                : 'Are you sure you want to verify this user? They will be able to access the system.'}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelModal}>
              Cancel
            </Button>
            <Button
              variant={
                modal.action === 'ACTIVATE'
                  ? 'default'
                  : modal.action === 'DEACTIVATE'
                    ? 'destructive'
                    : 'default'
              }
              onClick={confirmActivateDeactivateVerify}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
