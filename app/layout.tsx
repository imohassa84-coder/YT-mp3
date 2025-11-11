import type React from "react"
import { Geist } from "next/font/google"
import "./globals.css"
import ClientLayout from "./_clientLayout"

const _geist = Geist({ subsets: ["latin"] })

export const metadata = {
  title: "Yaelokre's diary - Music Search & Lyrics",
  description: "Search YouTube, view lyrics, and download music with Yaelokre's diary",
  generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${_geist.className}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
