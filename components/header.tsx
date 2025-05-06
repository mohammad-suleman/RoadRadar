"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, User, LogOut, Settings, ChevronDown, MapPin, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  const { isAuthenticated, user, logout, isLoading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const isActive = (path: string) => {
    return pathname === path
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "U"
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-8 w-8 mr-2 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                RoadRadar
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive("/") ? "bg-primary/10 text-primary" : "hover:bg-muted hover:text-primary"}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive("/about") ? "bg-primary/10 text-primary" : "hover:bg-muted hover:text-primary"}`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive("/contact") ? "bg-primary/10 text-primary" : "hover:bg-muted hover:text-primary"}`}
            >
              Contact Us
            </Link>
            
            {isAuthenticated && ( // Only show Detection Map if the user is logged in
              <Link
                href="/detection-dashboard"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive("/detection-dashboard") ? "bg-primary/10 text-primary" : "hover:bg-muted hover:text-primary"}`}
              >
                Detection Map
              </Link>
            )}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <AlertTriangle className="h-4 w-4" />
                      {notifications > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                          {notifications}
                        </span>
                      )}
                      <span className="sr-only">Notifications</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-auto">
                      <DropdownMenuItem className="flex flex-col items-start py-2">
                        <div className="flex items-center w-full">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <AlertTriangle className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New pothole detected</p>
                            <p className="text-xs text-muted-foreground">Main St & 5th Ave</p>
                          </div>
                          <Badge variant="outline" className="ml-2 text-xs">
                            New
                          </Badge>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start py-2">
                        <div className="flex items-center w-full">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <AlertTriangle className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Road crack detected</p>
                            <p className="text-xs text-muted-foreground">Broadway & 42nd St</p>
                          </div>
                          <Badge variant="outline" className="ml-2 text-xs">
                            New
                          </Badge>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start py-2">
                        <div className="flex items-center w-full">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <AlertTriangle className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Issue resolved</p>
                            <p className="text-xs text-muted-foreground">Park Ave & 23rd St</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center text-primary">View all notifications</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.photoURL || undefined} alt={user?.name || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user?.name || "User"}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                   
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/login">
                <Button className="group">
                  <span>Login</span>
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            )}
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-scale-in">
            <Link
              href="/"
              className={`block py-2 px-3 rounded-md text-sm font-medium ${isActive("/") ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`block py-2 px-3 rounded-md text-sm font-medium ${isActive("/about") ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`block py-2 px-3 rounded-md text-sm font-medium ${isActive("/contact") ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            
            {isAuthenticated && ( // Only show Detection Map if the user is logged in
              <Link
                href="/detection-dashboard"
                className={`block py-2 px-3 rounded-md text-sm font-medium ${isActive("/detection-dashboard") ? "bg-primary/10 text-primary" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Detection Map
              </Link>
            )}
            <div className="pt-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center px-3 py-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user?.photoURL || undefined} alt={user?.name || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={logout} className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Login</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}