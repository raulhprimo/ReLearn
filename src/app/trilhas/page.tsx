export const dynamic = 'force-dynamic'

import { buscarAreasComProgresso } from '@/server/actions/trilhas'
import { TrilhasClient } from './trilhas-client'
import { HugeiconsIcon } from '@hugeicons/react'
import { MapsIcon } from '@hugeicons/core-free-icons'

export default async function TrilhasPage() {
  const areas = await buscarAreasComProgresso()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <HugeiconsIcon icon={MapsIcon} size={28} className="text-emerald-400" />
          Trilhas
        </h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Acompanhe seu progresso por área. Clique nas áreas para expandir e atualizar o status dos tópicos.
        </p>
      </div>
      <TrilhasClient areas={areas} />
    </div>
  )
}
