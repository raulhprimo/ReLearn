import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql, relations } from 'drizzle-orm'

// ─── Áreas de conhecimento ───────────────────────────────────────────────────
export const areas = sqliteTable('areas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  codigo: text('codigo').notNull().unique(),
  nome: text('nome').notNull(),
  nivel: text('nivel').notNull(), // 'elementar' | 'avancado'
  cor: text('cor').notNull(),
  icone: text('icone').notNull(),
  ativa: integer('ativa', { mode: 'boolean' }).default(true),
  criadaEm: text('criada_em').default(sql`(datetime('now'))`),
})

// ─── Tópicos por área ────────────────────────────────────────────────────────
export const topicos = sqliteTable('topicos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  areaId: integer('area_id').notNull().references(() => areas.id),
  nome: text('nome').notNull(),
  descricao: text('descricao'),
  ordem: integer('ordem').notNull().default(0),
  status: text('status').notNull().default('nao_iniciado'),
  criadoEm: text('criado_em').default(sql`(datetime('now'))`),
  atualizadoEm: text('atualizado_em').default(sql`(datetime('now'))`),
})

// ─── Sessões de estudo ───────────────────────────────────────────────────────
export const sessoes = sqliteTable('sessoes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  topicoId: integer('topico_id').references(() => topicos.id),
  areaId: integer('area_id').references(() => areas.id),
  duracaoMin: integer('duracao_min').notNull().default(0),
  notasMd: text('notas_md').default(''),
  pomodorosCompletos: integer('pomodoros_completos').default(0),
  criadaEm: text('criada_em').default(sql`(datetime('now'))`),
})

// ─── Flashcards ──────────────────────────────────────────────────────────────
export const flashcards = sqliteTable('flashcards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  topicoId: integer('topico_id').references(() => topicos.id),
  areaId: integer('area_id').references(() => areas.id),
  sessaoId: integer('sessao_id').references(() => sessoes.id),
  frente: text('frente').notNull(),
  verso: text('verso').notNull(),
  due: text('due').default(sql`(datetime('now'))`),
  stability: real('stability').default(0),
  difficulty: real('difficulty').default(0),
  elapsedDays: integer('elapsed_days').default(0),
  scheduledDays: integer('scheduled_days').default(0),
  reps: integer('reps').default(0),
  lapses: integer('lapses').default(0),
  learningSteps: integer('learning_steps').default(0),
  state: integer('state').default(0),
  lastReview: text('last_review'),
  criadoEm: text('criado_em').default(sql`(datetime('now'))`),
})

// ─── Histórico de reviews ────────────────────────────────────────────────────
export const flashcardReviews = sqliteTable('flashcard_reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  flashcardId: integer('flashcard_id').notNull().references(() => flashcards.id),
  rating: text('rating').notNull(),
  reviewedAt: text('reviewed_at').default(sql`(datetime('now'))`),
})

// ─── Diagnóstico ─────────────────────────────────────────────────────────────
export const diagnostico = sqliteTable('diagnostico', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  areaId: integer('area_id').notNull().references(() => areas.id),
  subarea: text('subarea').notNull(),
  nota: integer('nota').notNull(),
  respondidoEm: text('respondido_em').default(sql`(datetime('now'))`),
})

// ─── Configurações ───────────────────────────────────────────────────────────
export const config = sqliteTable('config', {
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
export type Sessao = typeof sessoes.$inferSelect
export type Flashcard = typeof flashcards.$inferSelect
export type FlashcardReview = typeof flashcardReviews.$inferSelect
export type DiagnosticoResposta = typeof diagnostico.$inferSelect
