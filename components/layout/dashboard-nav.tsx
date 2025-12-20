"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, ClipboardCheck, Home, User, Settings, LogOut } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  adminOnly?: boolean
}

export function DashboardNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "Attendance",
      href: isAdmin ? "/admin/attendance-overview" : "/attendance-overview",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Excuse Form",
      href: "/attendance-form",
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      label: "Excuse Approval",
      href: "/admin/excuse-approval",
      icon: <ClipboardCheck className="h-5 w-5" />,
      adminOnly: true,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Signed out successfully")
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out")
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {navItems
          .filter((item) => !item.adminOnly || (item.adminOnly && isAdmin))
          .map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "outline"}
              size="sm"
              asChild
              className={pathname === item.href ? "bg-[#09331f] text-white" : ""}
            >
              <Link href={item.href} className="flex items-center gap-2">
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
