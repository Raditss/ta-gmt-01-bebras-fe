'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Shield,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import Image from 'next/image';
const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Shield },
  { href: '/manage-user', label: 'Users', icon: Users },
  { href: '/manage-question', label: 'Questions', icon: BookOpen }
];

export function AdminNav() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-2">
            <Image
              src="/graphic/Solvio-logo.svg"
              alt="logo"
              width={100}
              height={100}
              className="object-contain"
            />
            <span className="text-xl font-bold text-gray-800">Admin</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Admin Account
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@solvio.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Student View</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function AdminNavLinks() {
  const pathname = usePathname();
  return (
    <>
      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Right Side */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Search className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  Admin Account
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@solvio.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <Users className="mr-2 h-4 w-4" />
                <span>Student View</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
