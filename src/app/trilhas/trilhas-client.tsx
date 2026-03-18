'use client'
import { useState, useTransition } from 'react'
import { atualizarStatusTopico, type StatusTopico } from '@/server/actions/trilhas'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import type { Area, Topico } from '@/lib/schema'

interface AreaComProgresso extends Area {
  topicos: Topico[]
  total: number
  dominados: number
  emAndamento: number
  revisando: number
  progresso: number
}

interface TrilhasClientProps {
  areas: AreaComProgresso[]
}

const STATUS_CONFIG: Record<StatusTopico, { label: string; cor: string; bg: string }> = {
  nao_iniciado: { label: 'Não iniciado', cor: 'text-zinc-500', bg: 'bg-zinc-800 border-zinc-700' },
  em_andamento: { label: 'Estudando', cor: 'text-blue-400', bg: 'bg-blue-900/30 border-blue-800' },
  revisando: { label: 'Revisando', cor: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-800' },
  dominado: { label: 'Dominado', cor: 'text-green-400', bg: 'bg-green-900/30 border-green-800' },
}

const STATUS_ORDER: StatusTopico[] = ['nao_iniciado', 'em_andamento', 'revisando', 'dominado']

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as StatusTopico] ?? STATUS_CONFIG.nao_iniciado
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.bg} ${cfg.cor}`}>
      {cfg.label}
    </span>
  )
}

function StatusCycleButton({ topicoId, status }: { topicoId: number; status: string }) {
  const [isPending, startTransition] = useTransition()
  const currentIdx = STATUS_ORDER.indexOf(status as StatusTopico)
  const nextStatus = STATUS_ORDER[(currentIdx + 1) % STATUS_ORDER.length]

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    startTransition(() => {
      atualizarStatusTopico(topicoId, nextStatus)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-zinc-600 hover:text-zinc-300 px-2 py-0.5 rounded border border-zinc-700 hover:border-zinc-500 disabled:opacity-50"
    >
      {isPending ? '...' : '→ ' + STATUS_CONFIG[nextStatus].label}
    </button>
  )
}

function AreaCard({ area }: { area: AreaComProgresso }) {
  const [aberto, setAberto] = useState(false)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header da área */}
      <button
        onClick={() => setAberto((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-zinc-800/50 transition-colors text-left"
      >
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: area.cor }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{area.nome}</span>
            <span className="text-xs text-zinc-600 font-mono">{area.codigo}</span>
            <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-500 ml-1">
              {area.nivel}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <Progress
              value={area.progresso}
              className="h-1.5 flex-1 max-w-48"
            />
            <span className="text-xs text-zinc-500">
              {area.dominados}/{area.total} dominados
            </span>
            {area.emAndamento > 0 && (
              <span className="text-xs text-blue-400">{area.emAndamento} estudando</span>
            )}
          </div>
        </div>
        <span className="text-zinc-500 flex-shrink-0">
          {aberto ? <HugeiconsIcon icon={ArrowDown01Icon} size={16} /> : <HugeiconsIcon icon={ArrowRight01Icon} size={16} />}
        </span>
      </button>

      {/* Tópicos */}
      {aberto && (
        <div className="border-t border-zinc-800">
          {area.topicos.length === 0 ? (
            <p className="text-xs text-zinc-600 px-5 py-4">Nenhum tópico cadastrado.</p>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {area.topicos.map((topico) => (
                <div
                  key={topico.id}
                  className="group flex items-center justify-between px-5 py-3 hover:bg-zinc-800/30 transition-colors"
                >
                  <span className="text-sm text-zinc-300 flex-1 min-w-0 pr-4">{topico.nome}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusCycleButton topicoId={topico.id} status={topico.status} />
                    <StatusBadge status={topico.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function TrilhasClient({ areas }: TrilhasClientProps) {
  const elementares = areas.filter((a) => a.nivel === 'elementar')
  const avancadas = areas.filter((a) => a.nivel === 'avancado')

  const totalTopicos = areas.reduce((acc, a) => acc + a.total, 0)
  const totalDominados = areas.reduce((acc, a) => acc + a.dominados, 0)
  const totalEmAndamento = areas.reduce((acc, a) => acc + a.emAndamento, 0)

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Resumo geral */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-white">{totalTopicos}</p>
          <p className="text-xs text-zinc-500 mt-0.5">tópicos no total</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-blue-400">{totalEmAndamento}</p>
          <p className="text-xs text-zinc-500 mt-0.5">em andamento</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-center">
          <p className="text-2xl font-bold text-green-400">{totalDominados}</p>
          <p className="text-xs text-zinc-500 mt-0.5">dominados</p>
        </div>
      </div>

      {/* Áreas elementares */}
      {elementares.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nível Elementar</h2>
          {elementares.map((area) => <AreaCard key={area.id} area={area} />)}
        </div>
      )}

      {/* Áreas avançadas */}
      {avancadas.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nível Avançado</h2>
          {avancadas.map((area) => <AreaCard key={area.id} area={area} />)}
        </div>
      )}

      <p className="text-xs text-zinc-600 text-center pb-4">
        Clique em uma área para expandir os tópicos. Passe o mouse sobre um tópico para mudar o status.
      </p>
    </div>
  )
}
