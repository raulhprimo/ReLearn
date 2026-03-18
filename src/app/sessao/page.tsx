export const dynamic = 'force-dynamic'

import { buscarAreasComTopicos } from '@/server/actions/dashboard'
import { SessaoClient } from './sessao-client'

export default async function SessaoPage() {
  const areas = await buscarAreasComTopicos()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Sessão de Estudo</h1>
        <p className="text-zinc-400 mt-1 text-sm">Escolha o que estudar, use o Pomodoro e registre suas notas.</p>
      </div>
      <SessaoClient areas={areas} />
    </div>
  )
}
