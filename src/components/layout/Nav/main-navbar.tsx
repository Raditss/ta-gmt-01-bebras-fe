"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import {useAuthStore, User as AuthUser} from "@/store/auth.store"
import { RoleNav } from "@/components/layout/Nav/role-nav"

interface MainNavbarProps {
  user?: AuthUser | null;
  isAuthenticated?: boolean;
  logout?: () => void;
}

// This component only renders on the client side
export function MainNavbar({ user: propUser, isAuthenticated: propIsAuthenticated, logout: propLogout }: MainNavbarProps = {}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const auth = useAuthStore()
  const user = propUser !== undefined ? propUser : auth.user
  const isAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : auth.isAuthenticated
  const logout = propLogout !== undefined ? propLogout : auth.logout

  // Set mounted to true on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR and first render, return a minimal navbar
  if (!mounted) {
    return <MinimalNavbar />
  }

  return (
    <header className="bg-[#F8D15B] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/public" className="flex items-center space-x-2">
            <span className="font-semibold">Solvio</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/public" className="font-medium">
              Home
            </Link>
            <Link href="/about" className="font-medium">
              About
            </Link>

            {isAuthenticated && user && <RoleNav user={user} />}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-4 mt-8">
                <Link href="/public" className="font-medium py-2">
                  Home
                </Link>
                <Link href="/about" className="font-medium py-2">
                  About
                </Link>

                {isAuthenticated && user && (
                  <>
                    <RoleNav user={user} />
                    <Link href="/profile" className="font-medium py-2">
                      Profile
                    </Link>
                    <button onClick={logout} className="flex items-center gap-2 font-medium py-2 text-red-500">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                )}

                {!isAuthenticated && (
                  <>
                    <Link href="/login" className="font-medium py-2">
                      Login
                    </Link>
                    <Link href="/register" className="font-medium py-2">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.username} />
                  <AvatarFallback>{user.username?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="flex items-center">
                    <span className="text-xs">{user.streak ?? 0}</span>
                    <span className="text-yellow-500 text-xs ml-1">🔥</span>
                  </div>
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout} className="hidden md:flex">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-white text-black hover:bg-gray-100 rounded-full px-6">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

// This is a static version of the navbar that will be rendered during SSR
function MinimalNavbar() {
  return (
    <header className="bg-[#F8D15B] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6" />
            <span className="font-semibold">Solvio</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <span className="font-medium">Home</span>
            <span className="font-medium">About</span>
          </nav>
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <div>
          <Button className="bg-white text-black hover:bg-gray-100 rounded-full px-6">Login</Button>
        </div>
      </div>
    </header>
  )
}
