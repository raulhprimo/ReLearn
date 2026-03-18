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
} from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/',            label: 'Dashboard',  icon: DashboardSquare02Icon },
  { href: '/sessao',      label: 'Sessão',     icon: Timer02Icon },
  { href: '/review',      label: 'Review',     icon: ArrowReloadHorizontalIcon },
  { href: '/trilhas',     label: 'Trilhas',    icon: MapsIcon },
  { href: '/diagnostico', label: 'Diagnóstico', icon: TaskDone01Icon },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border">
      {/* Indicador de item ativo — barra superior */}
      <div className="flex">
        {NAV_ITEMS.map(({ href }) => (
          <div
            key={href}
            className={cn(
              'flex-1 h-0.5 transition-all duration-300',
              pathname === href ? 'bg-primary' : 'bg-transparent'
            )}
          />
        ))}
      </div>

      <div className="flex items-center justify-around px-1 pt-2 pb-5">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1.5 px-2 py-1.5 rounded-2xl transition-all duration-200 min-w-[56px] active:scale-95',
                isActive
                  ? 'text-primary'
                  : 'text-sidebar-foreground/40 hover:text-sidebar-foreground/70'
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200',
                isActive
                  ? 'bg-primary/15'
                  : 'bg-transparent'
              )}>
                <HugeiconsIcon
                  icon={icon}
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                />
              </div>
              <span className={cn(
                'text-[10px] font-semibold leading-none transition-all duration-200',
                isActive ? 'opacity-100' : 'opacity-50'
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
