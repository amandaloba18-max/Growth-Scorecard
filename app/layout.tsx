import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { ObjectiveProvider } from "@/lib/objectiveContext"
import { PeriodProvider } from "@/lib/periodContext"
import { Sidebar } from "@/components/Sidebar"
import { AppBar } from "@/components/AppBar"
import { FAB } from "@/components/FAB"
import { CommandPalette } from "@/components/CommandPalette"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Growth Scorecard",
  description: "Sistema operacional de crescimento",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className="bg-destructive" lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ObjectiveProvider>
            <PeriodProvider>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <AppBar />
                  <main className="flex-1 overflow-y-auto bg-background p-6">{children}</main>
                </div>
              </div>
              <FAB />
              <CommandPalette />
              <Toaster />
            </PeriodProvider>
          </ObjectiveProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
