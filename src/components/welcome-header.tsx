'use client'
import { useState, useRef, useEffect } from 'react'
import { AppleEmoji } from '@/components/apple-emoji'

function getSaudacao(): { texto: string; emoji: string } {
  const h = new Date().getHours()
  if (h < 12) return { texto: 'Bom dia', emoji: 'sunrise' }
  if (h < 18) return { texto: 'Boa tarde', emoji: 'sun' }
  return { texto: 'Boa noite', emoji: 'crescent-moon' }
}

export function WelcomeHeader({ quote }: { quote: string }) {
  const [foto, setFoto] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { texto, emoji } = getSaudacao()

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })

  useEffect(() => {
    const saved = localStorage.getItem('raul-foto')
    if (saved) setFoto(saved)
  }, [])

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      setFoto(url)
      localStorage.setItem('raul-foto', url)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex items-start justify-between gap-4">
      {/* Texto de boas-vindas */}
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">
            {texto}, Raul!
          </h1>
          <AppleEmoji name={emoji} width={26} />
        </div>
        <p className="text-muted-foreground text-sm capitalize">{hoje}</p>
        <p className="text-muted-foreground/70 text-xs italic leading-relaxed max-w-md hidden sm:block">
          {quote}
        </p>
      </div>

      {/* Avatar com upload */}
      <button
        onClick={() => inputRef.current?.click()}
        className="relative group flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-zinc-900 border-2 border-zinc-800 hover:border-primary transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        title="Clique para trocar sua foto"
        aria-label="Trocar foto de perfil"
      >
        {foto ? (
          <img src={foto} alt="Raul" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
            <span className="text-xl font-bold text-foreground/30">R</span>
          </div>
        )}

        {/* Overlay de hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-0.5">
          <span className="text-white text-[9px] font-semibold leading-tight text-center px-1">
            trocar foto
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFoto}
        />
      </button>
    </div>
  )
}
