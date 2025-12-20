import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GalleryBackground } from "@/components/ui/gallery-background"
import { AlertTriangle, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
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

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="mx-auto w-full max-w-md border-2 border-red-500/20 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 pb-7">
              <div className="flex justify-center mb-4 text-red-500">
                <AlertTriangle size={48} />
              </div>
              <CardTitle className="text-center text-red-600 text-2xl">Unauthorized Access</CardTitle>
              <CardDescription className="text-center">Only DLSU Chorale members can access this site</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 pb-6">
              <div className="space-y-4 text-center">
                <p className="text-gray-700">
                  Your email is not registered in our directory. If you are a member, please ensure you are using your
                  registered email address.
                </p>
                <p className="text-gray-700 font-medium">
                  If you believe this is an error, please contact the DLSU Chorale administrators.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 pt-6 flex justify-center">
              <Button asChild variant="default" className="w-full bg-[#09331f] hover:bg-[#09331f]/90 text-white">
                <Link href="/">Return to Home</Link>
              </Button>
            </CardFooter>
          </Card>
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
