export const dynamic = 'force-dynamic'

import { buscarFlashcardsParaRevisar } from '@/server/actions/flashcards'
import { ReviewClient } from './review-client'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { BrainIcon } from '@hugeicons/core-free-icons'

export default async function ReviewPage() {
  const cards = await buscarFlashcardsParaRevisar()

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <HugeiconsIcon icon={BrainIcon} size={28} className="text-purple-400" />
            Review
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            {cards.length > 0
              ? `${cards.length} card${cards.length > 1 ? 's' : ''} para revisar hoje`
              : 'Nenhum card pendente'}
          </p>
        </div>
        <Link
          href="/sessao"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          + Criar cards
        </Link>
      </div>

      <ReviewClient cards={cards} />
    </div>
  )
}
