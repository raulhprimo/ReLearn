import type { Metadata } from 'next'
import { Bricolage_Grotesque, Host_Grotesk, Geist_Mono } from 'next/font/google'
import './globals.css'
import { NavSidebar } from '@/components/nav-sidebar'
import { MobileHeader } from '@/components/mobile-header'
import { MobileNav } from '@/components/mobile-nav'

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const hostGrotesk = Host_Grotesk({
  variable: '--font-host',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Raul Learns',
  description: 'Sistema pessoal de estudos do Raul',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${bricolage.variable} ${hostGrotesk.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}>
        {/* Desktop: sidebar lateral */}
        <NavSidebar />

        {/* Mobile: header fixo no topo */}
        <MobileHeader />

        {/* Conteúdo principal */}
        <main className="
          min-h-screen
          md:ml-56 md:p-8
          pt-16 pb-28 px-4
        ">
          {children}
        </main>

        {/* Mobile: nav fixo no rodapé */}
        <MobileNav />
      </body>
    </html>
  )
}
