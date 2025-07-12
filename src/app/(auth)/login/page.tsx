'use client';

import React, { useEffect } from 'react';
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
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginRequestSchema } from '@/utils/validations/auth.validation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { z } from 'zod';
import { UserRole } from '@/types/user-role';

// Infer the form type from the zod schema
type LoginFormValues = z.infer<typeof loginRequestSchema>;

const loginFormSchema = loginRequestSchema.extend({
  password: z.string().min(1, 'Password is required')
});

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [loginError, setLoginError] = React.useState(false);
  const router = useRouter();
  const { login, isAuthenticated, user, isHydrated } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: '', password: '' }
  });

  useEffect(() => {
    setMounted(true);
    // Only redirect after hydration and if authenticated
    if (isHydrated && isAuthenticated) {
      if (user?.role === UserRole.ADMIN) {
        router.push('/admin');
      } else if (user?.role === UserRole.TEACHER) {
        router.push('/my-problem');
      } else if (user?.role === UserRole.STUDENT) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, router, user, isHydrated]);

  const onSubmit = async (data: LoginFormValues) => {
    if (!mounted) return;
    setLoginError(false);
    const result = await login(data);
    if (result) {
      toast.success('Login successful! Welcome back.');
    } else {
      setLoginError(true);
      setError('username', { message: ' ' }); // force error display
      setError('password', { message: ' ' });
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"></div>
            <span className="text-2xl font-bold text-gray-800">Solvio</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username or Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username or email"
                    className="pl-10"
                    {...register('username')}
                    autoComplete="username"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.username.message}
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
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    {...register('password')}
                    autoComplete="current-password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>

              {loginError && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  Login failed, please check your credential
                </p>
              )}
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-purple-600 hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>

            {mounted && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Demo Accounts</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Student:</span>
                    <span className="font-mono">student / password</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Teacher:</span>
                    <span className="font-mono">teacher / password</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin:</span>
                    <span className="font-mono">admin / password</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
