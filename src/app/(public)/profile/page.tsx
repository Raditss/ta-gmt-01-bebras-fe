'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Edit3, Save, X, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useProfile, ProfileFormData } from '@/hooks/useProfile';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserRole } from '@/types/user-role';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const { updateProfile, isLoading, error, success, clearMessages } =
    useProfile();
  const router = useRouter();

  const AVATAR_LIST = Array.from(
    { length: 10 },
    (_, i) => `/avatar/${i + 1}.png`
  );

  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
    photoUrl: ''
  });

  const noChanges =
    formData.username === user?.username &&
    formData.name === user?.name &&
    formData.photoUrl === (user?.photoUrl || '') &&
    !formData.password &&
    !formData.confirmPassword;

  useEffect(() => {
    setMounted(true);
    if (mounted && isHydrated && !isAuthenticated) {
      router.push('/login');
    }
    if (user) {
      setFormData({
        username: user.username || '',
        name: user.name || '',
        password: '',
        confirmPassword: '',
        photoUrl: user.photoUrl || ''
      });
    }
  }, [isAuthenticated, mounted, router, user, isHydrated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    clearMessages();
    // Reset form data
    if (user) {
      setFormData({
        username: user.username || '',
        name: user.name || '',
        password: '',
        confirmPassword: '',
        photoUrl: user.photoUrl || ''
      });
    }
  };

  // Show loading while hydrating or if not authenticated
  if (!mounted || !isHydrated || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() =>
                user.role === UserRole.STUDENT
                  ? router.push('/dashboard')
                  : user.role === UserRole.TEACHER
                    ? router.push('/my-problem')
                    : router.push('/admin')
              }
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={formData.photoUrl || '/placeholder.svg'}
                      alt={user.username}
                    />
                    <AvatarFallback className="text-lg">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </div>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="Enter your username"
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="Enter your display name"
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={user.role || ''}
                    disabled
                    className="bg-gray-50 capitalize"
                  />
                </div>

                {isEditing && (
                  <div className="mb-6">
                    <Label className="mb-2 block">Pilih Avatar</Label>
                    <div className="grid grid-cols-5 gap-3">
                      {AVATAR_LIST.map((src) => (
                        <button
                          type="button"
                          key={src}
                          className={`border-2 rounded-full p-1 transition-all ${formData.photoUrl === src ? 'border-cyan-500 ring-2 ring-cyan-300' : 'border-transparent'}`}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, photoUrl: src }))
                          }
                        >
                          <img
                            src={src}
                            alt="avatar"
                            className="w-14 h-14 rounded-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <p className="text-sm text-gray-600">
                      Leave blank to keep current password
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value
                              })
                            }
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                confirmPassword: e.target.value
                              })
                            }
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isEditing && noChanges && (
                  <div className="mb-4">
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">
                        No changes to save
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {isEditing && (
                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || noChanges}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
