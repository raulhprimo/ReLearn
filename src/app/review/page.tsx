export const dynamic = 'force-dynamic'

import { buscarFlashcardsParaRevisar } from '@/server/actions/flashcards'
import { ReviewClient } from './review-client'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { BrainIcon } from '@hugeicons/core-free-icons'
import { PageHeader } from '@/components/page-header'

export default async function ReviewPage() {
  const cards = await buscarFlashcardsParaRevisar()

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <PageHeader
        title="Review"
        description={
          cards.length > 0
            ? `${cards.length} card${cards.length > 1 ? 's' : ''} para revisar hoje`
            : 'Nenhum card pendente'
        }
        icon={<HugeiconsIcon icon={BrainIcon} size={24} className="text-purple-400" />}
        action={
          <Link href="/sessao" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            + Criar cards
          </Link>
        }
      />
      <ReviewClient cards={cards} />
    </div>
  )
}
