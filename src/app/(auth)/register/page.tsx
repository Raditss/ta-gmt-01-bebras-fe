'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAuthStore } from '@/store/auth.store';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { debounce } from 'lodash';
import { authApi } from '@/lib/api';

const registerFormSchema = z
  .object({
    name: z.string().min(1, 'Nama lengkap harus diisi'),
    username: z.string().min(1, 'Username harus diisi'),
    password: z
      .string()
      .min(8, 'Password harus minimal 8 karakter')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus (@$!%*?&)'
      ),
    confirmPassword: z.string().min(1, 'Harus konfirmasi password'),
    role: z.enum(['STUDENT', 'TEACHER'])
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords tidak sama',
    path: ['confirmPassword']
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  const router = useRouter();
  const {
    register: registerUser,
    isAuthenticated,
    user,
    isHydrated
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
    control
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: 'STUDENT'
    }
  });

  const password = watch('password');
  const username = watch('username');

  // Password complexity check for guideline
  const passwordMeetsComplexity =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  const checkUsername = debounce(async (username: string) => {
    if (!username) return;

    try {
      const data = await authApi.checkUsername({ username });

      if (!data.available) {
        setError('username', {
          type: 'manual',
          message: 'Username sudah digunakan'
        });
      } else {
        clearErrors('username');
      }
    } catch (_error) {
      setError('username', {
        type: 'manual',
        message: 'Gagal memeriksa username'
      });
    }
  }, 400);

  useEffect(() => {
    checkUsername(username);
  }, [username]);

  useEffect(() => {
    setMounted(true);
    // Only redirect after hydration and if authenticated
    if (isHydrated && isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/problems');
      }
    }
  }, [isAuthenticated, router, user, isHydrated]);

  const onSubmit = async (data: RegisterFormValues) => {
    setRegisterError(false);
    if (!mounted) return;
    const success = await registerUser({
      username: data.username,
      password: data.password,
      name: data.name,
      role: data.role
    });
    if (success) {
      router.push('/login');
    } else {
      setRegisterError(true);
    }
  };

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Left illustration */}
      <div className="flex-1 flex items-center justify-center p-1 md:p-2">
        <Image
          src="/graphic/register.png"
          alt="Register Illustration"
          width={700}
          height={700}
          className="max-w-full h-auto"
          priority
        />
      </div>
      {/* Right: register form (existing content) */}
      <div className="flex-1 flex items-center justify-center p-1 md:p-2">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-2">
            <Link href="/" className="inline-flex items-center space-x-2 mb-1">
              <Image
                src="/graphic/Solvio-logo.svg"
                alt="Solvio Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Buat Akun</CardTitle>
              <CardDescription>
                Bergabung dengan Solvio dan mulai perjalanan belajarmu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Masukkan nama lengkapmu"
                      className="pl-10"
                      {...register('name')}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.name && errors.name.message && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Masukkan username-mu"
                      className="pl-10"
                      {...register('username')}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.username && errors.username.message && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih peranmu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STUDENT">Solver</SelectItem>
                          <SelectItem value="TEACHER">Creator</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && errors.role.message && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Buat password-mu"
                      className="pl-10 pr-10"
                      {...register('password')}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p
                    className={`text-xs mt-1 ${password.length > 0 && !passwordMeetsComplexity ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    Password harus berisi minimal 8 karakter, 1 huruf besar, 1
                    huruf kecil, 1 angka, dan 1 karakter khusus (@$!%*?&)
                  </p>
                  {errors.password && errors.password.message && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Konfirmasi password-mu"
                      className="pl-10 pr-10"
                      {...register('confirmPassword')}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && errors.confirmPassword.message && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Membuat...' : 'Buat Akun'}
                </Button>
                {registerError && (
                  <p className="text-xs text-red-500 mt-2 text-center">
                    Registrasi gagal, silahkan coba lagi
                  </p>
                )}
              </form>
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-500">
                  Sudah punya akun?{' '}
                  <Link
                    href="/login"
                    className="text-purple-600 hover:underline"
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
