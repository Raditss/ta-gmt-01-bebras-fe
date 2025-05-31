import type React from "react"
import type { Metadata } from "next/types"
/* 
  TODO: revert back to use next/font/google
*/
import "./globals.css"

export const metadata: Metadata = {
  title: "CodeLeaf - Coding Challenge Platform",
  description: "Explore and solve coding challenges to improve your skills",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
        />
      </head>
      <body data-gptw="">
          {children}
      </body>
    </html>
  )
}
