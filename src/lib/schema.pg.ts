import { pgTable, text, integer, serial, doublePrecision, boolean } from 'drizzle-orm/pg-core'
import { sql, relations } from 'drizzle-orm'

// ─── Áreas de conhecimento ───────────────────────────────────────────────────
export const areas = pgTable('areas', {
  id: serial('id').primaryKey(),
  codigo: text('codigo').notNull().unique(),
  nome: text('nome').notNull(),
  nivel: text('nivel').notNull(), // 'elementar' | 'avancado'
  cor: text('cor').notNull(),
  icone: text('icone').notNull(),
  ativa: boolean('ativa').default(true),
  criadaEm: text('criada_em').default(sql`to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS')`),
})

// ─── Tópicos por área ────────────────────────────────────────────────────────
export const topicos = pgTable('topicos', {
  id: serial('id').primaryKey(),
  areaId: integer('area_id').notNull().references(() => areas.id),
  nome: text('nome').notNull(),
  descricao: text('descricao'),
  ordem: integer('ordem').notNull().default(0),
  status: text('status').notNull().default('nao_iniciado'),
  criadoEm: text('criado_em').default(sql`to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS')`),
  atualizadoEm: text('atualizado_em').default(sql`to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS')`),
})

// ─── Sessões de estudo ───────────────────────────────────────────────────────
export const sessoes = pgTable('sessoes', {
  id: serial('id').primaryKey(),
  topicoId: integer('topico_id').references(() => topicos.id),
  areaId: integer('area_id').references(() => areas.id),
  duracaoMin: integer('duracao_min').notNull().default(0),
  notasMd: text('notas_md').default(''),
  pomodorosCompletos: integer('pomodoros_completos').default(0),
  criadaEm: text('criada_em').default(sql`to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS')`),
})

// ─── Flashcards ──────────────────────────────────────────────────────────────
export const flashcards = pgTable('flashcards', {
  id: serial('id').primaryKey(),
  topicoId: integer('topico_id').references(() => topicos.id),
  areaId: integer('area_id').references(() => areas.id),
  sessaoId: integer('sessao_id').references(() => sessoes.id),
  frente: text('frente').notNull(),
  verso: text('verso').notNull(),
  due: text('due').default(sql`to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS')`),
  stability: doublePrecision('stability').default(0),
  difficulty: doublePrecision('difficulty').default(0),
  elapsedDays: integer('elapsed_days').default(0),
  scheduledDays: integer('scheduled_days').default(0),
  reps: integer('reps').default(0),
  lapses: integer('lapses').default(0),
  learningSteps: integer('learning_steps').default(0),
  state: integer('state').default(0),
  lastReview: text('last_review'),
  criadoEm: text('criado_em').default(sql`to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS')`),
})

// ─── Histórico de reviews ────────────────────────────────────────────────────
export const flashcardReviews = pgTable('flashcard_reviews', {
  id: serial('id').primaryKey(),
  flashcardId: integer('flashcard_id').notNull().references(() => flashcards.id),
  rating: text('rating').notNull(),
  reviewedAt: text('reviewed_at').default(sql`to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS')`),
})

// ─── Diagnóstico ─────────────────────────────────────────────────────────────
export const diagnostico = pgTable('diagnostico', {
  id: serial('id').primaryKey(),
  areaId: integer('area_id').notNull().references(() => areas.id),
  subarea: text('subarea').notNull(),
  nota: integer('nota').notNull(),
  respondidoEm: text('respondido_em').default(sql`to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS')`),
})

// ─── Configurações ───────────────────────────────────────────────────────────
export const config = pgTable('config', {
  chave: text('chave').primaryKey(),
  valor: text('valor').notNull(),
})

// ─── Relations ───────────────────────────────────────────────────────────────
export const areasRelations = relations(areas, ({ many }) => ({
  topicos: many(topicos),
  sessoes: many(sessoes),
}))

export const topicosRelations = relations(topicos, ({ one, many }) => ({
  area: one(areas, { fields: [topicos.areaId], references: [areas.id] }),
  sessoes: many(sessoes),
}))

export const sessoesRelations = relations(sessoes, ({ one }) => ({
  topico: one(topicos, { fields: [sessoes.topicoId], references: [topicos.id] }),
  area: one(areas, { fields: [sessoes.areaId], references: [areas.id] }),
}))

export const flashcardsRelations = relations(flashcards, ({ one, many }) => ({
  topico: one(topicos, { fields: [flashcards.topicoId], references: [topicos.id] }),
  area: one(areas, { fields: [flashcards.areaId], references: [areas.id] }),
  reviews: many(flashcardReviews),
}))

export const flashcardReviewsRelations = relations(flashcardReviews, ({ one }) => ({
  flashcard: one(flashcards, { fields: [flashcardReviews.flashcardId], references: [flashcards.id] }),
}))

export const diagnosticoRelations = relations(diagnostico, ({ one }) => ({
  area: one(areas, { fields: [diagnostico.areaId], references: [areas.id] }),
}))

// ─── Types inferidos ─────────────────────────────────────────────────────────
export type Area = typeof areas.$inferSelect
export type Topico = typeof topicos.$inferSelect
export type Flashcard = typeof flashcards.$inferSelect
export type FlashcardReview = typeof flashcardReviews.$inferSelect
export type DiagnosticoResposta = typeof diagnostico.$inferSelect
export type Sessao = typeof sessoes.$inferSelect
