/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */

// Schema is resolved lazily to ensure env vars are available.
// The Proxy delegates all property access to the correct dialect schema.
function getSchema() {
  const pgUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL
  return pgUrl ? require('./schema.pg') : require('./schema.sqlite')
}

const schemaProxy = new Proxy({} as any, {
  get(_, prop) {
    return getSchema()[prop]
  },
})

export const areas = schemaProxy.areas
export const topicos = schemaProxy.topicos
export const sessoes = schemaProxy.sessoes
export const flashcards = schemaProxy.flashcards
export const flashcardReviews = schemaProxy.flashcardReviews
export const diagnostico = schemaProxy.diagnostico
export const config = schemaProxy.config

export const areasRelations = schemaProxy.areasRelations
export const topicosRelations = schemaProxy.topicosRelations
export const sessoesRelations = schemaProxy.sessoesRelations
export const flashcardsRelations = schemaProxy.flashcardsRelations
export const flashcardReviewsRelations = schemaProxy.flashcardReviewsRelations
export const diagnosticoRelations = schemaProxy.diagnosticoRelations

// Types (structurally identical between dialects)
export type { Area, Topico, Sessao, Flashcard, FlashcardReview, DiagnosticoResposta } from './schema.sqlite'
