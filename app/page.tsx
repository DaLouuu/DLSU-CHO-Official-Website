import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GalleryBackground } from "@/components/ui/gallery-background"
import { WhiteLogo } from "@/components/ui/white-logo"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <GalleryBackground />
      <div className="flex min-h-screen flex-col relative z-10">
        {/* Header with DLSU Chorale branding */}
        <header className="bg-[#09331f] py-8 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-white">DLSU Chorale</h1>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center space-y-6 text-center mb-8">
              <WhiteLogo className="mb-2" />
              <h1 className="text-3xl font-bold tracking-tight text-white">DLSU Chorale Attendance System</h1>
              <p className="text-sm text-white/80">Manage attendance, submit excuses, and more</p>
            </div>

            <div className="flex flex-col space-y-4">
              <Button asChild className="w-full bg-white text-[#09331f] hover:bg-white/90">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="w-full bg-[#09331f]/20 text-white hover:bg-[#09331f]/30 border border-white/30"
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-[#1B1B1B] py-6 shadow-inner">
          <div className="container mx-auto px-4 text-center text-white text-sm">
            &copy; {new Date().getFullYear()} DLSU Chorale. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}
