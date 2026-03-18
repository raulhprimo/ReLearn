'use client'
import { useState, useTransition } from 'react'
import { salvarDiagnostico } from '@/server/actions/diagnostico'
import { DiagnosticoRadar } from '@/components/diagnostico-radar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon, ArrowRight01Icon, FloppyDiskIcon, ChartColumnIcon } from '@hugeicons/core-free-icons'
import type { Area, Topico } from '@/lib/schema'

interface AreaComTopicos extends Area {
  topicos: Topico[]
}

interface RespostaExistente {
  areaId: number
  subarea: string
  nota: number
}

interface DiagnosticoClientProps {
  areas: AreaComTopicos[]
  respostasIniciais: RespostaExistente[]
  mediasIniciais: { area: { nome: string; cor: string }; media: number }[]
}

function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const labels = ['', 'Não sei nada', 'Sei pouco', 'Sei razoável', 'Sei bem', 'Domino']
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          title={labels[n]}
          className={`w-7 h-7 rounded text-sm font-bold transition-colors ${
            n <= value
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300'
          }`}
        >
          {n}
        </button>
      ))}
      {value > 0 && (
        <span className="text-xs text-zinc-500 ml-2">{labels[value]}</span>
      )}
    </div>
  )
}

export function DiagnosticoClient({ areas, respostasIniciais, mediasIniciais }: DiagnosticoClientProps) {
  const [notas, setNotas] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {}
    for (const r of respostasIniciais) {
      m[`${r.areaId}__${r.subarea}`] = r.nota
    }
    return m
  })
  const [areaAberta, setAreaAberta] = useState<number | null>(areas[0]?.id ?? null)
  const [isPending, startTransition] = useTransition()
  const [salvo, setSalvo] = useState(false)
  const [medias, setMedias] = useState(mediasIniciais)
  const [aba, setAba] = useState<'questionario' | 'mapa'>('questionario')

  function setNota(areaId: number, subarea: string, nota: number) {
    setNotas((prev) => ({ ...prev, [`${areaId}__${subarea}`]: nota }))
    setSalvo(false)
  }

  function handleSalvar() {
    const respostas: { areaId: number; subarea: string; nota: number }[] = []
    for (const [chave, nota] of Object.entries(notas)) {
      const [areaIdStr, subarea] = chave.split('__')
      respostas.push({ areaId: Number(areaIdStr), subarea, nota })
    }

    startTransition(async () => {
      await salvarDiagnostico(respostas)
      // Recalcula médias localmente
      const novosMedias = areas.map((area) => {
        const topicosNotas = area.topicos
          .map((t) => notas[`${area.id}__${t.nome}`] ?? 0)
          .filter((n) => n > 0)
        if (topicosNotas.length === 0) return null
        const media = topicosNotas.reduce((a, b) => a + b, 0) / topicosNotas.length
        return { area: { nome: area.nome, cor: area.cor }, media: Math.round(media * 10) / 10 }
      }).filter(Boolean) as { area: { nome: string; cor: string }; media: number }[]
      setMedias(novosMedias)
      setSalvo(true)
    })
  }

  const totalRespondidos = Object.keys(notas).length
  const totalTopicos = areas.reduce((acc, a) => acc + a.topicos.length, 0)

  const radarDados = medias.map((m) => ({
    area: m.area.nome,
    nota: m.media,
    fullMark: 5,
  }))

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Progresso geral */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-center">
            <p className="text-xl font-bold text-white">{totalRespondidos}</p>
            <p className="text-xs text-zinc-500">de {totalTopicos} respondidos</p>
          </div>
          {salvo && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              ✓ Salvo
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setAba('questionario')}
            className={`text-sm gap-1.5 ${aba === 'questionario' ? 'text-white bg-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            Questionário
          </Button>
          <Button
            variant="ghost"
            onClick={() => setAba('mapa')}
            className={`text-sm gap-1.5 ${aba === 'mapa' ? 'text-white bg-zinc-800' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <HugeiconsIcon icon={ChartColumnIcon} size={14} />
            Mapa de lacunas
          </Button>
        </div>
      </div>

      {/* Aba: Mapa */}
      {aba === 'mapa' && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">
              Radar de conhecimento — média por área (1–5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DiagnosticoRadar dados={radarDados} />
            {medias.length > 0 && (
              <div className="mt-4 space-y-2">
                {medias
                  .sort((a, b) => a.media - b.media)
                  .map((m) => (
                    <div key={m.area.nome} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: m.area.cor }} />
                      <span className="text-sm text-zinc-300 flex-1">{m.area.nome}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-zinc-800 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-indigo-500"
                            style={{ width: `${(m.media / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-zinc-400 w-6 text-right">{m.media}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Aba: Questionário */}
      {aba === 'questionario' && (
        <>
          {areas.map((area) => {
            const respondidosArea = area.topicos.filter((t) => notas[`${area.id}__${t.nome}`] > 0).length
            const mediaArea = respondidosArea > 0
              ? area.topicos
                  .map((t) => notas[`${area.id}__${t.nome}`] ?? 0)
                  .filter(Boolean)
                  .reduce((a, b) => a + b, 0) / respondidosArea
              : 0

            return (
              <Card key={area.id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-zinc-800/50 transition-colors text-left"
                  onClick={() => setAreaAberta(areaAberta === area.id ? null : area.id)}
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: area.cor }} />
                  <span className="font-medium text-white flex-1">{area.nome}</span>
                  <div className="flex items-center gap-2">
                    {respondidosArea > 0 && (
                      <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                        {respondidosArea}/{area.topicos.length} · média {mediaArea.toFixed(1)}
                      </Badge>
                    )}
                    {areaAberta === area.id ? (
                      <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="text-zinc-500" />
                    ) : (
                      <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-zinc-500" />
                    )}
                  </div>
                </button>

                {areaAberta === area.id && (
                  <div className="border-t border-zinc-800 divide-y divide-zinc-800/60">
                    {area.topicos.map((topico) => {
                      const chave = `${area.id}__${topico.nome}`
                      const nota = notas[chave] ?? 0
                      return (
                        <div key={topico.id} className="flex items-center justify-between px-5 py-3 gap-4">
                          <span className="text-sm text-zinc-300 flex-1 min-w-0">{topico.nome}</span>
                          <StarRating value={nota} onChange={(v) => setNota(area.id, topico.nome, v)} />
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            )
          })}

          <Button
            onClick={handleSalvar}
            disabled={isPending || totalRespondidos === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
          >
            <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
            {isPending ? 'Salvando...' : 'Salvar diagnóstico'}
          </Button>
        </>
      )}
    </div>
  )
}
