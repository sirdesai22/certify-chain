import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
// import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"
import { UserProvider } from "@/context/userContext"

export const metadata: Metadata = {
  title: "CertChain - Decentralised Certificate Validation Platform",
  description:"Verify certificates with blockchain technology. Secure, instant, and tamper-proof certificate validation.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider defaultTheme="dark" storageKey="certchain-theme">
            <UserProvider>{children}</UserProvider>
          </ThemeProvider>
        </Suspense>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
