'use client'
import { useState, useEffect } from 'react'
import { AppleEmoji } from '@/components/apple-emoji'
import { avaliarFlashcard } from '@/server/actions/flashcards'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { RefreshIcon, ArrowRight01Icon, KeyboardIcon } from '@hugeicons/core-free-icons'
import type { Area, Topico, Flashcard } from '@/lib/schema'
import Link from 'next/link'

type FlashcardComRelacoes = Flashcard & { area: Area | null; topico: Topico | null }

interface ReviewClientProps {
  cards: FlashcardComRelacoes[]
}

type Rating = 'again' | 'hard' | 'good' | 'easy'

export function ReviewClient({ cards }: ReviewClientProps) {
  const [idx, setIdx] = useState(0)
  const [virado, setVirado] = useState(false)
  const [avaliando, setAvaliando] = useState(false)
  const [concluidos, setConcluidos] = useState(0)
  const [atalhoAtivo, setAtalhoAtivo] = useState(false)

  const total = cards.length
  const card = cards[idx]

  async function handleAvaliar(rating: Rating) {
    if (avaliando || idx >= total) return
    setAvaliando(true)
    try {
      await avaliarFlashcard(card.id, rating)
      setConcluidos((n) => n + 1)
      setVirado(false)
      setIdx((i) => i + 1)
    } finally {
      setAvaliando(false)
    }
  }

  // ─── Atalhos de teclado ───────────────────────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Ignorar se foco estiver em input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return

      if (e.code === 'Space') {
        e.preventDefault()
        if (!virado) setVirado(true)
        return
      }
      if (!virado) return // demais atalhos só funcionam com card virado

      if (e.key === '1') handleAvaliar('again')
      else if (e.key === '2') handleAvaliar('hard')
      else if (e.key === '3') handleAvaliar('good')
      else if (e.key === '4') handleAvaliar('easy')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [virado, avaliando, idx, total]) // eslint-disable-line react-hooks/exhaustive-deps

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <AppleEmoji name="party-popper" width={56} />
        <p className="text-white font-semibold text-xl">Tudo em dia!</p>
        <p className="text-zinc-400 text-sm">Nenhum flashcard para revisar agora.</p>
        <Link href="/sessao" className="text-indigo-400 hover:text-indigo-300 text-sm">
          Criar flashcards em uma sessão →
        </Link>
      </div>
    )
  }

  if (idx >= total) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <AppleEmoji name="check-mark-button" width={56} />
        <p className="text-white font-semibold text-xl">Revisão concluída!</p>
        <p className="text-zinc-400 text-sm">{concluidos} cards revisados hoje.</p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">
          Voltar ao dashboard →
        </Link>
      </div>
    )
  }

  const progresso = Math.round((idx / total) * 100)

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Progresso */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">{idx + 1} / {total}</span>
        <div className="flex-1 mx-4 bg-zinc-800 rounded-full h-1.5">
          <div
            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progresso}%` }}
          />
        </div>
        {card.area && (
          <Badge
            variant="outline"
            className="text-xs border-zinc-700"
            style={{ borderColor: card.area.cor + '66', color: card.area.cor }}
          >
            {card.area.codigo}
          </Badge>
        )}
      </div>

      {/* Card */}
      <div
        className="min-h-[260px] bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-colors hover:border-zinc-700"
        onClick={() => !virado && setVirado(true)}
      >
        {!virado ? (
          <div className="space-y-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Frente</p>
            <p className="text-xl font-medium text-white leading-relaxed">{card.frente}</p>
            <p className="text-xs text-zinc-600 mt-6">Clique ou pressione <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">Espaço</kbd></p>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <div className="pb-4 border-b border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">Frente</p>
              <p className="text-base text-zinc-300">{card.frente}</p>
            </div>
            <div className="pt-2">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">Verso</p>
              <p className="text-xl font-medium text-white leading-relaxed">{card.verso}</p>
            </div>
          </div>
        )}
      </div>

      {/* Botões de avaliação */}
      {!virado ? (
        <Button
          onClick={() => setVirado(true)}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white gap-2"
        >
          <HugeiconsIcon icon={RefreshIcon} size={16} />
          Revelar resposta
        </Button>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 text-center mb-3">Como foi?</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => handleAvaliar('again')}
              disabled={avaliando}
              className="bg-red-900/40 hover:bg-red-900/70 border border-red-800 text-red-300 flex-col h-16 gap-0.5"
            >
              <span className="text-base font-bold">✗</span>
              <span className="text-xs">Errei</span>
              <span className="text-xs text-red-600/70">[ 1 ]</span>
            </Button>
            <Button
              onClick={() => handleAvaliar('hard')}
              disabled={avaliando}
              className="bg-orange-900/40 hover:bg-orange-900/70 border border-orange-800 text-orange-300 flex-col h-16 gap-0.5"
            >
              <span className="text-base font-bold">~</span>
              <span className="text-xs">Difícil</span>
              <span className="text-xs text-orange-600/70">[ 2 ]</span>
            </Button>
            <Button
              onClick={() => handleAvaliar('good')}
              disabled={avaliando}
              className="bg-green-900/40 hover:bg-green-900/70 border border-green-800 text-green-300 flex-col h-16 gap-0.5"
            >
              <span className="text-base font-bold">✓</span>
              <span className="text-xs">Ok</span>
              <span className="text-xs text-green-600/70">[ 3 ]</span>
            </Button>
          </div>
          <Button
            onClick={() => handleAvaliar('easy')}
            disabled={avaliando}
            className="w-full bg-indigo-900/40 hover:bg-indigo-900/70 border border-indigo-800 text-indigo-300 gap-2 h-10"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            Fácil — já sei bem
            <span className="text-xs text-indigo-600/70 ml-1">[ 4 ]</span>
          </Button>
        </div>
      )}

      {/* Legenda atalhos */}
      <button
        onClick={() => setAtalhoAtivo((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors mx-auto"
      >
        <HugeiconsIcon icon={KeyboardIcon} size={14} />
        atalhos de teclado
      </button>
      {atalhoAtivo && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400 space-y-1.5">
          <div className="flex gap-3"><kbd className="bg-zinc-800 px-1.5 py-0.5 rounded">Espaço</kbd><span>Revelar resposta</span></div>
          <div className="flex gap-3"><kbd className="bg-zinc-800 px-1.5 py-0.5 rounded">1</kbd><span>Errei</span></div>
          <div className="flex gap-3"><kbd className="bg-zinc-800 px-1.5 py-0.5 rounded">2</kbd><span>Difícil</span></div>
          <div className="flex gap-3"><kbd className="bg-zinc-800 px-1.5 py-0.5 rounded">3</kbd><span>Ok</span></div>
          <div className="flex gap-3"><kbd className="bg-zinc-800 px-1.5 py-0.5 rounded">4</kbd><span>Fácil</span></div>
        </div>
      )}
    </div>
  )
}
