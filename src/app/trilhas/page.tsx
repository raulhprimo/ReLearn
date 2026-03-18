export const dynamic = 'force-dynamic'

import { buscarAreasComProgresso } from '@/server/actions/trilhas'
import { TrilhasClient } from './trilhas-client'
import { HugeiconsIcon } from '@hugeicons/react'
import { MapsIcon } from '@hugeicons/core-free-icons'
import { PageHeader } from '@/components/page-header'

export default async function TrilhasPage() {
  const areas = await buscarAreasComProgresso()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trilhas"
        description="Acompanhe seu progresso por área. Clique nas áreas para expandir e atualizar o status dos tópicos."
        icon={<HugeiconsIcon icon={MapsIcon} size={24} className="text-emerald-400" />}
      />
      <TrilhasClient areas={areas} />
    </div>
  )
}
