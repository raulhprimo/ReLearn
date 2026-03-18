'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DashboardSquare02Icon,
  Timer02Icon,
  ArrowReloadHorizontalIcon,
  MapsIcon,
  TaskDone01Icon,
  BookOpen02Icon,
} from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: DashboardSquare02Icon },
  { href: '/sessao', label: 'Sessão', icon: Timer02Icon },
  { href: '/review', label: 'Review', icon: ArrowReloadHorizontalIcon },
  { href: '/trilhas', label: 'Trilhas', icon: MapsIcon },
  { href: '/diagnostico', label: 'Diagnóstico', icon: TaskDone01Icon },
]

export function NavSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-56 bg-zinc-900 border-r border-zinc-800 flex-col z-10">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-zinc-800">
        <HugeiconsIcon icon={BookOpen02Icon} size={24} className="text-indigo-400" />
        <span className="font-bold text-white text-lg">ReLearn</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}
            >
              <HugeiconsIcon icon={icon} size={16} className="flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-zinc-800 space-y-2">
        <ThemeToggle />
        <p className="text-xs text-zinc-700 px-2">v0.1 — local-first</p>
      </div>
    </aside>
  )
}
