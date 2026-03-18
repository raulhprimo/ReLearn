export const dynamic = 'force-dynamic'

import { HugeiconsIcon } from '@hugeicons/react'
import { FireIcon, Clock01Icon, BrainIcon, BookOpen02Icon, ZapIcon, Target02Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ActivityGraph } from '@/components/activity-graph'
import { buscarDadosDashboard } from '@/server/actions/dashboard'
import { AppleEmoji } from '@/components/apple-emoji'
import { WelcomeHeader } from '@/components/welcome-header'
import Link from 'next/link'

const CITACOES = [
  '"A educação é a arma mais poderosa que você pode usar para mudar o mundo." — Nelson Mandela',
  '"Invista em conhecimento, pois ele rende os melhores juros." — Benjamin Franklin',
  '"A mente que se abre a uma nova ideia jamais voltará ao seu tamanho original." — Albert Einstein',
  '"Aprender é a única coisa que a mente nunca se cansa, nunca tem medo e nunca se arrepende." — Leonardo da Vinci',
  '"O sucesso é a soma de pequenos esforços repetidos dia após dia." — Robert Collier',
]

function getCitacaoDoDia(): string {
  const hoje = new Date()
  const idx = hoje.getDate() % CITACOES.length
  return CITACOES[idx]
}

function formatarTempo(minutos: number): string {
  if (minutos < 60) return `${minutos}min`
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

function formatarData(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default async function DashboardPage() {
  const dados = await buscarDadosDashboard()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Boas-vindas */}
      <WelcomeHeader quote={getCitacaoDoDia()} />

      {/* Cards de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <HugeiconsIcon icon={FireIcon} size={16} className="text-orange-400" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">{dados.streak}</p>
            <p className="text-sm text-zinc-500 mt-1">
              {dados.streak === 1 ? 'dia consecutivo' : 'dias consecutivos'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <HugeiconsIcon icon={Clock01Icon} size={16} className="text-blue-400" />
              Tempo esta semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">{formatarTempo(dados.tempoSemanaMin)}</p>
            <p className="text-sm text-zinc-500 mt-1">últimos 7 dias</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <HugeiconsIcon icon={BrainIcon} size={16} className="text-purple-400" />
              Para revisar hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">{dados.flashcardsHojeCount}</p>
            <p className="text-sm text-zinc-500 mt-1">
              {dados.flashcardsHojeCount === 0 ? (
                <span className="flex items-center gap-1">tudo em dia! <AppleEmoji name="party-popper" width={14} /></span>
              ) : 'flashcards pendentes'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sugestão de foco */}
      {dados.focoSugerido && (
        <div
          className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4"
          style={{ borderLeftColor: dados.focoSugerido.area.cor, borderLeftWidth: 3 }}
        >
          <HugeiconsIcon icon={Target02Icon} size={20} className="flex-shrink-0" style={{ color: dados.focoSugerido.area.cor }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Foco sugerido pelo diagnóstico</p>
            <p className="text-white font-semibold mt-0.5">{dados.focoSugerido.area.nome}</p>
            <p className="text-xs text-zinc-500">Média atual: {dados.focoSugerido.media}/5 — sua área com mais lacunas</p>
          </div>
          <Link
            href="/sessao"
            className="text-xs text-zinc-400 hover:text-white transition-colors flex-shrink-0 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg"
          >
            Estudar →
          </Link>
        </div>
      )}

      {/* Ações rápidas */}
      <div className="flex gap-3">
        <Link
          href="/sessao"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <HugeiconsIcon icon={ZapIcon} size={16} />
          Estudar agora
        </Link>
        {dados.flashcardsHojeCount > 0 && (
          <Link
            href="/review"
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <HugeiconsIcon icon={BrainIcon} size={16} />
            Revisar {dados.flashcardsHojeCount} cards
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de atividade */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">
              Atividade — últimas 4 semanas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityGraph sessoes={dados.sessoesRecentes} />
          </CardContent>
        </Card>

        {/* Últimas sessões */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <HugeiconsIcon icon={BookOpen02Icon} size={16} />
              Últimas sessões
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dados.ultimasSessoes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-zinc-500 text-sm">Nenhuma sessão ainda.</p>
                <Link href="/sessao" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">
                  Comece agora →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {dados.ultimasSessoes.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {s.topico?.nome ?? s.area?.nome ?? 'Sessão livre'}
                      </p>
                      <p className="text-xs text-zinc-500">{formatarData(s.criadaEm)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.area && (
                        <Badge
                          variant="outline"
                          className="text-xs border-zinc-700 text-zinc-400"
                          style={{ borderColor: s.area.cor + '66', color: s.area.cor }}
                        >
                          {s.area.codigo}
                        </Badge>
                      )}
                      <span className="text-xs text-zinc-500">{s.duracaoMin}min</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
