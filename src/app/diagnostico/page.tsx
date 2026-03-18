export const dynamic = 'force-dynamic'

import { buscarDiagnostico, buscarMediasPorArea } from '@/server/actions/diagnostico'
import { buscarAreasComTopicos } from '@/server/actions/dashboard'
import { DiagnosticoClient } from './diagnostico-client'
import { HugeiconsIcon } from '@hugeicons/react'
import { TaskDone01Icon } from '@hugeicons/core-free-icons'
import { PageHeader } from '@/components/page-header'

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
      <PageHeader
        title="Diagnóstico"
        description="Avalie seu conhecimento de 1 a 5 em cada tópico. Isso guia seu plano de estudos."
        icon={<HugeiconsIcon icon={TaskDone01Icon} size={24} className="text-yellow-400" />}
      />
      <DiagnosticoClient
        areas={areas}
        respostasIniciais={respostasFormatadas}
        mediasIniciais={mediasFormatadas}
      />
    </div>
  )
}
