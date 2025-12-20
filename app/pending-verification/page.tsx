import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GalleryBackground } from "@/components/ui/gallery-background"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function PendingVerificationPage() {
  return (
    <div className="min-h-screen">
      <GalleryBackground />
      <div className="flex min-h-screen flex-col relative z-10">
        {/* Header with DLSU Chorale branding */}
        <header className="bg-[#09331f] py-8 shadow-md">
          <div className="container mx-auto px-4 flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-4 text-white hover:bg-[#09331f]/50">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-white">DLSU Chorale</h1>
          </div>
        </header>

        {/* Main content - increased padding top and bottom */}
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="mx-auto w-full max-w-md border-2 border-[#09331f]/20 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 pb-7">
              <div className="flex justify-center mb-4">
                <div className="relative" style={{ width: 80, height: 100 }}>
                  <Image src="/images/dlsu-chorale-logo.png" alt="DLSU Chorale Logo" fill className="object-contain" />
                </div>
              </div>
              <CardTitle className="text-center text-[#09331f] text-2xl">Verification Pending</CardTitle>
              <CardDescription className="text-center">Your account is awaiting admin verification</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 pb-6">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="rounded-full bg-[#09331f]/10 p-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#09331f]"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-medium text-[#1B1B1B]">Awaiting Admin Verification</h3>
                  <p className="text-[#1B1B1B]/80 max-w-sm mx-auto">
                    An administrator needs to verify your account against the member/trainee directory. This process may
                    take some time.
                  </p>
                  <p className="text-[#1B1B1B]/80 font-medium">
                    You'll receive an email notification once your account has been verified.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 pt-6">
              <Button asChild variant="outline" className="w-full border-[#09331f] text-[#09331f] hover:bg-[#09331f]/5">
                <Link href="/">Return to Home</Link>
              </Button>
            </CardFooter>
          </Card>
        </main>

        {/* Footer - increased padding */}
        <footer className="bg-[#1B1B1B] py-6 shadow-inner">
          <div className="container mx-auto px-4 text-center text-white text-sm">
            &copy; {new Date().getFullYear()} DLSU Chorale. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  )
}
