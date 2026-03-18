import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, icon, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6 md:mb-8', className)}>
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
          {icon && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0 pt-0.5">{action}</div>
      )}
    </div>
  )
}
