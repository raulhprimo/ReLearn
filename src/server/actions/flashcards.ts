'use server'
import { db } from '@/lib/db'
import { flashcards, flashcardReviews } from '@/lib/schema'
import { processReview, createEmptyCard } from '@/lib/fsrs'
import { revalidatePath } from 'next/cache'
import { eq, lte } from 'drizzle-orm'
import type { Card } from 'ts-fsrs'

export async function criarFlashcard(data: {
  frente: string
  verso: string
  topicoId: number | null
  areaId: number | null
  sessaoId: number | null
}) {
  const empty = createEmptyCard()
  await db.insert(flashcards).values({
    frente: data.frente,
    verso: data.verso,
    topicoId: data.topicoId,
    areaId: data.areaId,
    sessaoId: data.sessaoId,
    due: empty.due.toISOString(),
    stability: empty.stability,
    difficulty: empty.difficulty,
    elapsedDays: empty.elapsed_days,
    scheduledDays: empty.scheduled_days,
    learningSteps: empty.learning_steps,
    reps: empty.reps,
    lapses: empty.lapses,
    state: empty.state,
    lastReview: undefined,
  })
  revalidatePath('/')
  revalidatePath('/review')
}

export async function criarFlashcardsBatch(cards: {
  frente: string
  verso: string
  topicoId: number | null
  areaId: number | null
  sessaoId: number | null
}[]) {
  if (cards.length === 0) return
  const empty = createEmptyCard()
  await db.insert(flashcards).values(
    cards.map((c) => ({
      frente: c.frente,
      verso: c.verso,
      topicoId: c.topicoId,
      areaId: c.areaId,
      sessaoId: c.sessaoId,
      due: empty.due.toISOString(),
      stability: empty.stability,
      difficulty: empty.difficulty,
      elapsedDays: empty.elapsed_days,
      scheduledDays: empty.scheduled_days,
      learningSteps: empty.learning_steps,
      reps: empty.reps,
      lapses: empty.lapses,
      state: empty.state,
      lastReview: undefined,
    }))
  )
  revalidatePath('/')
  revalidatePath('/review')
}

export async function buscarFlashcardsParaRevisar() {
  const agora = new Date().toISOString()
  return db.query.flashcards.findMany({
    where: lte(flashcards.due, agora),
    with: { area: true, topico: true },
    orderBy: (f, { asc }) => [asc(f.due)],
  })
}

export async function avaliarFlashcard(
  id: number,
  rating: 'again' | 'hard' | 'good' | 'easy'
) {
  const card = await db.query.flashcards.findFirst({ where: eq(flashcards.id, id) })
  if (!card) throw new Error('Card não encontrado')

  const fsrsCard: Card = {
    due: new Date(card.due ?? new Date()),
    stability: card.stability ?? 0,
    difficulty: card.difficulty ?? 0,
    elapsed_days: card.elapsedDays ?? 0,
    scheduled_days: card.scheduledDays ?? 0,
    learning_steps: card.learningSteps ?? 0,
    reps: card.reps ?? 0,
    lapses: card.lapses ?? 0,
    state: card.state ?? 0,
    last_review: card.lastReview ? new Date(card.lastReview) : undefined,
  }

  const updated = processReview(fsrsCard, rating)

  await db
    .update(flashcards)
    .set({
      due: updated.due.toISOString(),
      stability: updated.stability,
      difficulty: updated.difficulty,
      elapsedDays: updated.elapsed_days,
      scheduledDays: updated.scheduled_days,
      learningSteps: updated.learning_steps,
      reps: updated.reps,
      lapses: updated.lapses,
      state: updated.state,
      lastReview: updated.last_review?.toISOString() ?? null,
    })
    .where(eq(flashcards.id, id))

  await db.insert(flashcardReviews).values({
    flashcardId: id,
    rating,
  })

  revalidatePath('/')
  revalidatePath('/review')
}
