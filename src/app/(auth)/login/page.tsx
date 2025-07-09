"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginRequestSchema } from "@/utils/validations/auth.validation"
import { toast } from "sonner"
import { useAuthStore } from "@/store/auth.store";
import { z } from "zod";
import { UserRole } from "@/types/user-role"

// Infer the form type from the zod schema
type LoginFormValues = z.infer<typeof loginRequestSchema>

const loginFormSchema = loginRequestSchema.extend({
  password: z.string().min(1, "Password is required"),
});

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [loginError, setLoginError] = React.useState(false)
  const router = useRouter()
  const { login, isAuthenticated, user } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  })

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated) {
      if (user?.role === UserRole.ADMIN) {
        router.push("/admin")
      } else if (user?.role === UserRole.TEACHER) {
        router.push("/problems")
      } else if (user?.role === UserRole.STUDENT) {
        router.push("/dashboard")
      }
      else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, router, user])

  const onSubmit = async (data: LoginFormValues) => {
    if (!mounted) return
    setLoginError(false)
    const result = await login(data)
    if (result) {
      toast.success("Login successful! Welcome back.")
    } else {
      setLoginError(true)
      setError("username", { message: " " }) // force error display
      setError("password", { message: " " })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Illustration Side */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-6">
          <div className="w-80 h-80 bg-gradient-to-br from-yellow-200 via-purple-200 to-blue-200 rounded-3xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-700">Welcome Back!</h3>
              <p className="text-gray-600 mt-2">Continue your coding journey</p>
            </div>
          </div>
        </div>

        {/* Login Form Side */}
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
              <CardDescription>Enter your credentials to access your account</CardDescription>
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
                      {...register("username")}
                      autoComplete="username"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      {...register("password")}
                      autoComplete="current-password"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && errors.password.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Link href="#" className="text-sm text-purple-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                {loginError && (
                  <p className="text-xs text-red-500 mt-2 text-center">Login failed, please check your credential</p>
                )}
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-500">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-purple-600 hover:underline">
                    Register here
                  </Link>
                </p>
              </div>

              {mounted && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Demo Accounts</h3>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div>
                      <p className="font-medium">Student Account:</p>
                      <p>Username: <span className="font-mono">johndoe</span></p>
                      <p>Password: <span className="font-mono">password123</span></p>
                    </div>
                    <div>
                      <p className="font-medium">Teacher Account:</p>
                      <p>Username: <span className="font-mono">teacher</span></p>
                      <p>Password: <span className="font-mono">password123</span></p>
                    </div>
                    <div>
                      <p className="font-medium">Admin Account:</p>
                      <p>Username: <span className="font-mono">admin</span></p>
                      <p>Password: <span className="font-mono">password123</span></p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LoginPage