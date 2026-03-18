'use client'
import { usePathname } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import { BookOpen02Icon } from '@hugeicons/core-free-icons'
import { ThemeToggle } from '@/components/theme-toggle'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/sessao': 'Sessão',
  '/review': 'Review',
  '/trilhas': 'Trilhas',
  '/diagnostico': 'Diagnóstico',
}

export function MobileHeader() {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? 'Raul Learns'

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
            <HugeiconsIcon icon={BookOpen02Icon} size={16} className="text-primary" />
          </div>
          <span className="font-bold text-sidebar-foreground text-base tracking-tight">
            Raul Learns
          </span>
        </div>

        {/* Título da página atual + toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-widest">
            {title}
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
