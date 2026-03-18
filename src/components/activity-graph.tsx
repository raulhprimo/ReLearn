'use client'

interface Sessao {
  criadaEm: string | null
  duracaoMin: number
}

interface ActivityGraphProps {
  sessoes: Sessao[]
}

export function ActivityGraph({ sessoes }: ActivityGraphProps) {
  // Gera os últimos 28 dias
  const hoje = new Date()
  const dias: { date: string; minutos: number }[] = []

  for (let i = 27; i >= 0; i--) {
    const d = new Date(hoje)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const minutos = sessoes
      .filter((s) => (s.criadaEm ?? '').slice(0, 10) === dateStr)
      .reduce((acc, s) => acc + s.duracaoMin, 0)
    dias.push({ date: dateStr, minutos })
  }

  const maxMin = Math.max(...dias.map((d) => d.minutos), 1)

  function getColor(minutos: number): string {
    if (minutos === 0) return 'bg-zinc-800'
    const ratio = minutos / maxMin
    if (ratio < 0.25) return 'bg-indigo-900'
    if (ratio < 0.5) return 'bg-indigo-700'
    if (ratio < 0.75) return 'bg-indigo-500'
    return 'bg-indigo-400'
  }

  // Agrupa em semanas (4 linhas de 7)
  const semanas: typeof dias[] = []
  for (let i = 0; i < 28; i += 7) {
    semanas.push(dias.slice(i, i + 7))
  }

  const weekLabels = ['4 sem', '3 sem', '2 sem', 'Esta sem']
  const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

  return (
    <div className="space-y-2">
      <div className="flex gap-1 items-start">
        <div className="flex flex-col gap-1 mr-1 mt-6">
          {dayLabels.map((l, i) => (
            <div key={i} className="h-7 flex items-center">
              <span className="text-xs text-zinc-500 w-4">{l}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {semanas.map((semana, si) => (
            <div key={si} className="flex-1 flex flex-col gap-1">
              <span className="text-xs text-zinc-500 text-center">{weekLabels[si]}</span>
              {semana.map((dia, di) => (
                <div
                  key={di}
                  className={`h-7 rounded ${getColor(dia.minutos)} transition-colors`}
                  title={`${dia.date}: ${dia.minutos} min`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <span>Menos</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded bg-zinc-800" />
          <div className="w-3 h-3 rounded bg-indigo-900" />
          <div className="w-3 h-3 rounded bg-indigo-700" />
          <div className="w-3 h-3 rounded bg-indigo-500" />
          <div className="w-3 h-3 rounded bg-indigo-400" />
        </div>
        <span>Mais</span>
      </div>
    </div>
  )
}
