import { buscarDiagnostico, buscarMediasPorArea } from '@/server/actions/diagnostico'
import { buscarAreasComTopicos } from '@/server/actions/dashboard'
import { DiagnosticoClient } from './diagnostico-client'
import { HugeiconsIcon } from '@hugeicons/react'
import { TaskDone01Icon } from '@hugeicons/core-free-icons'

export default async function DiagnosticoPage() {
  const [areas, respostas, medias] = await Promise.all([
    buscarAreasComTopicos(),
    buscarDiagnostico(),
    buscarMediasPorArea(),
  ])

  const respostasFormatadas = respostas.map((r) => ({
    areaId: r.areaId,
    subarea: r.subarea,
    nota: r.nota,
  }))

  const mediasFormatadas = medias.map((m) => ({
    area: { nome: m.area.nome, cor: m.area.cor },
    media: m.media,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <HugeiconsIcon icon={TaskDone01Icon} size={28} className="text-yellow-400" />
          Diagnóstico
        </h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Avalie seu conhecimento de 1 a 5 em cada tópico. Isso guia seu plano de estudos.
        </p>
      </div>
      <DiagnosticoClient
        areas={areas}
        respostasIniciais={respostasFormatadas}
        mediasIniciais={mediasFormatadas}
      />
    </div>
  )
}
