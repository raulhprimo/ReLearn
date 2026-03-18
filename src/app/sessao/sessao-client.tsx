'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppleEmoji } from '@/components/apple-emoji'
import { PomodoroTimer } from '@/components/pomodoro-timer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { criarSessao } from '@/server/actions/sessoes'
import { criarFlashcardsBatch } from '@/server/actions/flashcards'
import type { Area, Topico } from '@/lib/schema'
import { HugeiconsIcon } from '@hugeicons/react'
import { BookOpen02Icon, File01Icon, PlusSignIcon, Delete02Icon, BrainIcon } from '@hugeicons/core-free-icons'

interface SessaoClientProps {
  areas: (Area & { topicos: Topico[] })[]
}

interface FlashcardRascunho {
  frente: string
  verso: string
}

type Etapa = 'estudar' | 'flashcards' | 'salvo'

export function SessaoClient({ areas }: SessaoClientProps) {
  const router = useRouter()
  const [areaId, setAreaId] = useState<string>('')
  const [topicoId, setTopicoId] = useState<string>('')
  const [notas, setNotas] = useState('')
  const [etapa, setEtapa] = useState<Etapa>('estudar')
  const [sessaoId, setSessaoId] = useState<number | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [rascunhos, setRascunhos] = useState<FlashcardRascunho[]>([{ frente: '', verso: '' }])

  const areaSelecionada = areas.find((a) => String(a.id) === areaId)
  const topicosSelecionados = areaSelecionada?.topicos ?? []

  function handleAreaChange(v: string | null) {
    setAreaId(v ?? '')
    setTopicoId('')
  }

  function handleTopicoChange(v: string | null) {
    setTopicoId(v ?? '')
  }

  async function handleComplete(duracaoMin: number, pomodorosCompletos: number) {
    setSalvando(true)
    try {
      const { sessaoId: id } = await criarSessao({
        topicoId: topicoId ? Number(topicoId) : null,
        areaId: areaId ? Number(areaId) : null,
        duracaoMin,
        notasMd: notas,
        pomodorosCompletos,
      })
      setSessaoId(id)
      setEtapa('flashcards')
    } catch (err) {
      console.error(err)
    } finally {
      setSalvando(false)
    }
  }

  async function handleSalvarFlashcards() {
    const validos = rascunhos.filter((r) => r.frente.trim() && r.verso.trim())
    if (validos.length > 0 && sessaoId !== null) {
      await criarFlashcardsBatch(
        validos.map((r) => ({
          frente: r.frente.trim(),
          verso: r.verso.trim(),
          topicoId: topicoId ? Number(topicoId) : null,
          areaId: areaId ? Number(areaId) : null,
          sessaoId,
        }))
      )
    }
    setEtapa('salvo')
    setTimeout(() => router.push('/'), 1500)
  }

  function adicionarRascunho() {
    setRascunhos((prev) => [...prev, { frente: '', verso: '' }])
  }

  function removerRascunho(idx: number) {
    setRascunhos((prev) => prev.filter((_, i) => i !== idx))
  }

  function atualizarRascunho(idx: number, campo: 'frente' | 'verso', valor: string) {
    setRascunhos((prev) => prev.map((r, i) => (i === idx ? { ...r, [campo]: valor } : r)))
  }

  // ─── Etapa: salvo ────────────────────────────────────────────────────────────
  if (etapa === 'salvo') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <AppleEmoji name="check-mark-button" width={48} />
          <p className="text-white font-medium text-lg">Sessão salva!</p>
          <p className="text-zinc-400 text-sm">Redirecionando para o dashboard...</p>
        </div>
      </div>
    )
  }

  // ─── Etapa: criar flashcards ──────────────────────────────────────────────────
  if (etapa === 'flashcards') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HugeiconsIcon icon={BrainIcon} size={20} className="text-purple-400" />
              Criar flashcards da sessão
            </CardTitle>
            <p className="text-sm text-zinc-400">
              Opcional — adicione os conceitos que quer memorizar. Ou pule se preferir.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {rascunhos.map((r, idx) => (
              <div key={idx} className="space-y-2 p-3 bg-zinc-800 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-500 font-medium">Card {idx + 1}</span>
                  {rascunhos.length > 1 && (
                    <button
                      onClick={() => removerRascunho(idx)}
                      className="text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={14} />
                    </button>
                  )}
                </div>
                <Input
                  placeholder="Frente (pergunta / conceito)"
                  value={r.frente}
                  onChange={(e) => atualizarRascunho(idx, 'frente', e.target.value)}
                  className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500 text-sm"
                />
                <Input
                  placeholder="Verso (resposta / definição)"
                  value={r.verso}
                  onChange={(e) => atualizarRascunho(idx, 'verso', e.target.value)}
                  className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-500 text-sm"
                />
              </div>
            ))}

            <Button
              onClick={adicionarRascunho}
              variant="ghost"
              className="w-full border border-dashed border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 gap-2"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              Adicionar card
            </Button>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSalvarFlashcards}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                {rascunhos.some((r) => r.frente.trim() && r.verso.trim())
                  ? `Salvar ${rascunhos.filter((r) => r.frente.trim() && r.verso.trim()).length} card(s) e concluir`
                  : 'Concluir sem flashcards'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview das notas */}
        {notas && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xs text-zinc-500">Suas notas (referência)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">{notas}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // ─── Etapa: estudar ───────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {/* Coluna esquerda: seleção + timer */}
      <div className="space-y-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <HugeiconsIcon icon={BookOpen02Icon} size={16} />
              O que vou estudar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Área</label>
              <Select value={areaId} onValueChange={handleAreaChange}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Selecionar área..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {areas.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)} className="text-white hover:bg-zinc-700">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0 inline-block" style={{ backgroundColor: a.cor }} />
                        {a.nome}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {topicosSelecionados.length > 0 && (
              <div>
                <label className="text-xs text-zinc-500 mb-1.5 block">Tópico</label>
                <Select value={topicoId} onValueChange={handleTopicoChange}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Selecionar tópico..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {topicosSelecionados.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)} className="text-white hover:bg-zinc-700">
                        {t.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">
              Timer Pomodoro (25/5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PomodoroTimer onComplete={handleComplete} />
          </CardContent>
        </Card>
      </div>

      {/* Coluna direita: notas */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <HugeiconsIcon icon={File01Icon} size={16} />
            Notas (markdown)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder={`# O que aprendi hoje\n\n## Conceitos principais\n-\n\n## O que ainda não entendi\n-\n\n## Referências\n- `}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 min-h-[400px] font-mono text-sm resize-none"
            disabled={salvando}
          />
        </CardContent>
      </Card>
    </div>
  )
}
