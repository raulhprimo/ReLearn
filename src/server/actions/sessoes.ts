'use server'
import { db } from '@/lib/db'
import { sessoes, topicos } from '@/lib/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export async function criarSessao(data: {
  topicoId: number | null
  areaId: number | null
  duracaoMin: number
  notasMd: string
  pomodorosCompletos: number
}): Promise<{ sessaoId: number }> {
  const result = await db.insert(sessoes).values({
    topicoId: data.topicoId,
    areaId: data.areaId,
    duracaoMin: data.duracaoMin,
    notasMd: data.notasMd,
    pomodorosCompletos: data.pomodorosCompletos,
  }).returning({ id: sessoes.id })

  const sessaoId = result[0].id

  // Atualizar status do tópico para 'em_andamento' se ainda for 'nao_iniciado'
  if (data.topicoId) {
    const topico = await db.query.topicos.findFirst({
      where: eq(topicos.id, data.topicoId),
    })
    if (topico?.status === 'nao_iniciado') {
      await db.update(topicos)
        .set({ status: 'em_andamento' })
        .where(eq(topicos.id, data.topicoId))
    }
  }

  revalidatePath('/')
  revalidatePath('/sessao')
  return { sessaoId }
}

export async function buscarUltimasSessoes(limite = 5) {
  return db.query.sessoes.findMany({
    orderBy: (s, { desc }) => [desc(s.criadaEm)],
    limit: limite,
    with: {
      topico: true,
      area: true,
    },
  })
}

export async function buscarSessoesUltimas4Semanas() {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 28)
  const cutoffStr = cutoff.toISOString().split('T')[0]

  return db.query.sessoes.findMany({
    where: (s, { gte }) => gte(s.criadaEm, cutoffStr),
    orderBy: (s, { asc }) => [asc(s.criadaEm)],
  })
}
