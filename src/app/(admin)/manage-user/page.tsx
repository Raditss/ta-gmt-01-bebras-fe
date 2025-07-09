"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, UserMinus, GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import {useAuthStore} from "@/store/auth.store";

const MOCK_USERS = [
  {
    id: 1,
    name: "Alice Teacher",
    email: "alice.teacher@example.com",
    role: "TEACHER",
    status: "PENDING",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Bob Teacher",
    email: "bob.teacher@example.com",
    role: "TEACHER",
    status: "VERIFIED",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Charlie Student",
    email: "charlie.student@example.com",
    role: "STUDENT",
    status: "ACTIVE",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Dana Teacher",
    email: "dana.teacher@example.com",
    role: "TEACHER",
    status: "UNDER_REVIEW",
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Eve Student",
    email: "eve.student@example.com",
    role: "STUDENT",
    status: "BANNED",
    avatar: "/placeholder.svg",
  },
];

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  VERIFIED: "bg-green-100 text-green-800",
  ACTIVE: "bg-green-100 text-green-800",
  UNDER_REVIEW: "bg-blue-100 text-blue-800",
  BANNED: "bg-red-100 text-red-800",
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modal, setModal] = useState<{ open: boolean; userId: number | null; action: "BAN" | "UNBAN" | null }>({ open: false, userId: null, action: null });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const updateUserStatus = (id: number, newStatus: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleBanUnban = (userId: number, action: "BAN" | "UNBAN") => {
    setModal({ open: true, userId, action });
  };

  const confirmBanUnban = () => {
    if (modal.userId && modal.action) {
      updateUserStatus(
        modal.userId,
        modal.action === "BAN"
          ? "BANNED"
          : users.find((u) => u.id === modal.userId)?.role === "TEACHER"
          ? "VERIFIED"
          : "ACTIVE"
      );
    }
    setModal({ open: false, userId: null, action: null });
  };

  const cancelModal = () => setModal({ open: false, userId: null, action: null });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-black" />
              <h1 className="text-2xl font-bold">Manage Users</h1>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <input
              type="search"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex gap-2 w-full md:w-auto justify-end">
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">All Roles</option>
                <option value="TEACHER">Teacher</option>
                <option value="STUDENT">Student</option>
              </select>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
                <option value="ACTIVE">Active</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="BANNED">Banned</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{user.role}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[user.status as keyof typeof STATUS_COLORS]}`}>{user.status.replace('_', ' ')}</span>
                  </TableCell>
                  <TableCell className="space-x-2">
                    {/* Actions based on role and status */}
                    {user.role === 'TEACHER' && user.status === 'PENDING' && (
                      <Button size="sm" className="bg-green-400 hover:bg-green-500 text-black" onClick={() => updateUserStatus(user.id, 'VERIFIED')}>Verify</Button>
                    )}
                    {(user.status === 'ACTIVE' || user.status === 'VERIFIED') && (
                      <Button size="sm" variant="outline" onClick={() => updateUserStatus(user.id, 'UNDER_REVIEW')}>Review</Button>
                    )}
                    {user.status === 'UNDER_REVIEW' && (
                      <Button size="sm" variant="outline" onClick={() => updateUserStatus(user.id, user.role === 'TEACHER' ? 'VERIFIED' : 'ACTIVE')}>Restore</Button>
                    )}
                    {user.status !== 'BANNED' && (
                      <Button size="sm" variant="destructive" onClick={() => handleBanUnban(user.id, 'BAN')}>Ban</Button>
                    )}
                    {user.status === 'BANNED' && (
                      <Button size="sm" variant="outline" onClick={() => handleBanUnban(user.id, 'UNBAN')}>Unban</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      {/* Ban/Unban Confirmation Modal */}
      <Dialog open={modal.open} onOpenChange={cancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modal.action === "BAN" ? "Confirm Ban" : "Confirm Unban"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {modal.action === "BAN"
              ? "Are you sure you want to ban this user? They will not be able to access the system."
              : "Are you sure you want to unban this user? They will regain access to the system."}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelModal}>Cancel</Button>
            <Button variant={modal.action === "BAN" ? "destructive" : "default"} onClick={confirmBanUnban}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
