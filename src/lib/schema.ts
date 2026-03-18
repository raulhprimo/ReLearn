import * as sqlite from './schema.sqlite'
import * as pg from './schema.pg'

// Use SQLite types as canonical (structurally identical to PG)
// At runtime, the correct dialect tables are chosen via DATABASE_URL
const s = (process.env.DATABASE_URL ? pg : sqlite) as unknown as typeof sqlite

// ─── Tables (dialect chosen by DATABASE_URL) ─────────────────────────────────
export const areas = s.areas
export const topicos = s.topicos
export const sessoes = s.sessoes
export const flashcards = s.flashcards
export const flashcardReviews = s.flashcardReviews
export const diagnostico = s.diagnostico
export const config = s.config

// ─── Relations ───────────────────────────────────────────────────────────────
export const areasRelations = s.areasRelations
export const topicosRelations = s.topicosRelations
export const sessoesRelations = s.sessoesRelations
export const flashcardsRelations = s.flashcardsRelations
export const flashcardReviewsRelations = s.flashcardReviewsRelations
export const diagnosticoRelations = s.diagnosticoRelations

// ─── Types ───────────────────────────────────────────────────────────────────
export type { Area, Topico, Sessao, Flashcard, FlashcardReview, DiagnosticoResposta } from './schema.sqlite'
