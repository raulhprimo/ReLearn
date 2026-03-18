'use server'
import { db } from '@/lib/db'
import { topicos } from '@/lib/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export type StatusTopico = 'nao_iniciado' | 'em_andamento' | 'revisando' | 'dominado'

export async function atualizarStatusTopico(topicoId: number, status: StatusTopico) {
  await db
    .update(topicos)
    .set({ status, atualizadoEm: new Date().toISOString() })
    .where(eq(topicos.id, topicoId))
  revalidatePath('/trilhas')
}

export async function buscarAreasComProgresso() {
  const areasData = await db.query.areas.findMany({
    where: (a, { eq, and }) => and(eq(a.ativa, true), eq(a.nivel, 'elementar')),
    with: {
      topicos: {
        orderBy: (t, { asc }) => [asc(t.ordem)],
      },
    },
    orderBy: (a, { asc }) => [asc(a.nivel), asc(a.nome)],
  })

  return areasData.map((area) => {
    const total = area.topicos.length
    const dominados = area.topicos.filter((t) => t.status === 'dominado').length
    const emAndamento = area.topicos.filter((t) => t.status === 'em_andamento').length
    const revisando = area.topicos.filter((t) => t.status === 'revisando').length
    const progresso = total > 0 ? Math.round((dominados / total) * 100) : 0
    return { ...area, total, dominados, emAndamento, revisando, progresso }
  })
}
