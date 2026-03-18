'use client'
import { useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Sun01Icon, Moon02Icon } from '@hugeicons/core-free-icons'

export function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const isDark = stored !== 'light'
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors w-full px-2 py-1.5 rounded hover:bg-zinc-800"
      title={dark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
    >
      {dark ? <HugeiconsIcon icon={Sun01Icon} size={14} /> : <HugeiconsIcon icon={Moon02Icon} size={14} />}
      {dark ? 'Modo claro' : 'Modo escuro'}
    </button>
  )
}
