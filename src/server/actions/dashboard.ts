'use server'
import { db } from '@/lib/db'
import { buscarFocoSugerido } from '@/server/actions/diagnostico'

export async function buscarDadosDashboard() {
  const hoje = new Date()
  const hojeStr = hoje.toISOString().split('T')[0]

  // Buscar todas as sessões
  const todasSessoes = await db.query.sessoes.findMany({
    orderBy: (s, { asc }) => [asc(s.criadaEm)],
  })

  // Streak: dias consecutivos com sessão até hoje
  const diasComSessao = new Set(
    todasSessoes.map((s) => s.criadaEm?.split('T')[0] ?? s.criadaEm?.slice(0, 10) ?? '')
  )
  let streak = 0
  const checkDate = new Date(hoje)
  while (true) {
    const d = checkDate.toISOString().split('T')[0]
    if (diasComSessao.has(d)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  // Tempo estudado esta semana (últimos 7 dias)
  const semanaAtras = new Date(hoje)
  semanaAtras.setDate(semanaAtras.getDate() - 6)
  const semanaAtrasStr = semanaAtras.toISOString().split('T')[0]
  const sessoesSemanais = todasSessoes.filter((s) => {
    const d = s.criadaEm?.slice(0, 10) ?? ''
    return d >= semanaAtrasStr && d <= hojeStr
  })
  const tempoSemanaMin = sessoesSemanais.reduce((acc, s) => acc + s.duracaoMin, 0)

  // Flashcards para revisar hoje
  const flashcardsHoje = await db.query.flashcards.findMany({
    where: (f, { lte }) => lte(f.due, hojeStr + 'T23:59:59'),
  })

  // Atividade das últimas 4 semanas (28 dias)
  const cutoff = new Date(hoje)
  cutoff.setDate(cutoff.getDate() - 27)
  const cutoffStr = cutoff.toISOString().split('T')[0]
  const sessoesRecentes = todasSessoes.filter((s) => {
    const d = s.criadaEm?.slice(0, 10) ?? ''
    return d >= cutoffStr
  })

  // Últimas 3 sessões com área
  const ultimasSessoes = await db.query.sessoes.findMany({
    orderBy: (s, { desc }) => [desc(s.criadaEm)],
    limit: 3,
    with: { area: true, topico: true },
  })

  // Sugestão de foco baseada no diagnóstico
  const focoSugerido = await buscarFocoSugerido()

  return {
    streak,
    tempoSemanaMin,
    flashcardsHojeCount: flashcardsHoje.length,
    sessoesRecentes,
    ultimasSessoes,
    focoSugerido,
  }
}

export async function buscarAreasComTopicos() {
  return db.query.areas.findMany({
    where: (a, { eq, and }) => and(eq(a.ativa, true), eq(a.nivel, 'elementar')),
    with: { topicos: { orderBy: (t, { asc }) => [asc(t.ordem)] } },
    orderBy: (a, { asc }) => [asc(a.nome)],
  })
}
