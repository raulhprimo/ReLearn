'use server'
import { db } from '@/lib/db'
import { diagnostico } from '@/lib/schema'
import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'

export async function salvarDiagnostico(respostas: { areaId: number; subarea: string; nota: number }[]) {
  // Upsert: deletar entradas existentes e reinserir
  for (const r of respostas) {
    await db
      .delete(diagnostico)
      .where(and(eq(diagnostico.areaId, r.areaId), eq(diagnostico.subarea, r.subarea)))
    await db.insert(diagnostico).values({
      areaId: r.areaId,
      subarea: r.subarea,
      nota: r.nota,
    })
  }
  revalidatePath('/')
  revalidatePath('/diagnostico')
}

export async function buscarDiagnostico() {
  return db.query.diagnostico.findMany({
    with: { area: true },
    orderBy: (d, { asc }) => [asc(d.areaId), asc(d.subarea)],
  })
}

// Para o dashboard: média por área (áreas com nota mais baixa = lacunas)
export async function buscarFocoSugerido() {
  const respostas = await db.query.diagnostico.findMany({
    with: { area: true },
  })

  if (respostas.length === 0) return null

  // Agrupa por área e calcula média
  const porArea = new Map<number, { area: typeof respostas[0]['area']; notas: number[] }>()
  for (const r of respostas) {
    if (!r.area) continue
    if (!porArea.has(r.areaId)) {
      porArea.set(r.areaId, { area: r.area, notas: [] })
    }
    porArea.get(r.areaId)!.notas.push(r.nota)
  }

  let piorMedia = 6
  let areaSugerida: typeof respostas[0]['area'] | null = null

  for (const [, { area, notas }] of porArea) {
    const media = notas.reduce((a, b) => a + b, 0) / notas.length
    if (media < piorMedia) {
      piorMedia = media
      areaSugerida = area
    }
  }

  if (!areaSugerida) return null
  return { area: areaSugerida, media: Math.round(piorMedia * 10) / 10 }
}

// Para o gráfico radar: média por área
export async function buscarMediasPorArea() {
  const respostas = await db.query.diagnostico.findMany({
    with: { area: true },
  })

  const porArea = new Map<number, { area: typeof respostas[0]['area']; notas: number[] }>()
  for (const r of respostas) {
    if (!r.area) continue
    if (!porArea.has(r.areaId)) porArea.set(r.areaId, { area: r.area, notas: [] })
    porArea.get(r.areaId)!.notas.push(r.nota)
  }

  return Array.from(porArea.values()).map(({ area, notas }) => ({
    area: area!,
    media: Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 10) / 10,
    total: notas.length,
  }))
}
