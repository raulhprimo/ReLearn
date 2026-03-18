export const dynamic = 'force-dynamic'

import { buscarAreasComTopicos } from '@/server/actions/dashboard'
import { SessaoClient } from './sessao-client'
import { PageHeader } from '@/components/page-header'
import { HugeiconsIcon } from '@hugeicons/react'
import { Timer02Icon } from '@hugeicons/core-free-icons'

export default async function SessaoPage() {
  const areas = await buscarAreasComTopicos()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sessão de Estudo"
        description="Escolha o que estudar, use o Pomodoro e registre suas notas."
        icon={<HugeiconsIcon icon={Timer02Icon} size={24} className="text-blue-400" />}
      />
      <SessaoClient areas={areas} />
    </div>
  )
}
