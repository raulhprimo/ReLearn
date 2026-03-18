'use client'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface RadarDatum {
  area: string
  nota: number
  fullMark: number
}

interface DiagnosticoRadarProps {
  dados: RadarDatum[]
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: RadarDatum }[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm">
      <p className="text-white font-medium">{d.area}</p>
      <p className="text-zinc-400">Nota média: <span className="text-indigo-400 font-bold">{d.nota}</span>/5</p>
    </div>
  )
}

export function DiagnosticoRadar({ dados }: DiagnosticoRadarProps) {
  if (dados.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500 text-sm">
        Responda o questionário para ver o mapa de lacunas.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart data={dados} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="#3f3f46" />
        <PolarAngleAxis
          dataKey="area"
          tick={{ fill: '#a1a1aa', fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Radar
          name="Nota"
          dataKey="nota"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
          dot={{ fill: '#6366f1', r: 3 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
