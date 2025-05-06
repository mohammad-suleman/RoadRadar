import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/context/auth-context"
import 'mapbox-gl/dist/mapbox-gl.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RoadRadar - Road Monitoring System",
  description: "Online pothole and crack monitoring system",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap AuthProvider directly around body contents */}
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}