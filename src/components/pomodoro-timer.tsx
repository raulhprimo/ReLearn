'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlayIcon, PauseIcon, RefreshIcon, Coffee01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

type TimerState = 'idle' | 'focus' | 'break' | 'done'

interface PomodoroTimerProps {
  onComplete: (duracaoMin: number, pomodoros: number) => void
}

const FOCUS_MIN = 25
const BREAK_MIN = 5

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  } catch {
    // sem suporte a Web Audio API
  }
}

export function PomodoroTimer({ onComplete }: PomodoroTimerProps) {
  const [state, setState] = useState<TimerState>('idle')
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MIN * 60)
  const [pomodoros, setPomodoros] = useState(0)
  const [totalFocusSec, setTotalFocusSec] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const focusSecRef = useRef(0)

  const totalSeconds = state === 'break' ? BREAK_MIN * 60 : FOCUS_MIN * 60
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startFocus = useCallback(() => {
    setState('focus')
    setSecondsLeft(FOCUS_MIN * 60)
    focusSecRef.current = 0
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        focusSecRef.current += 1
        if (s <= 1) {
          return 0
        }
        return s - 1
      })
    }, 1000)
  }, [])

  // Detectar fim do pomodoro ou pausa
  useEffect(() => {
    if (secondsLeft === 0) {
      stopInterval()
      beep()
      if (state === 'focus') {
        const newPomodoros = pomodoros + 1
        setPomodoros(newPomodoros)
        setTotalFocusSec((prev) => prev + focusSecRef.current)
        setState('break')
        setSecondsLeft(BREAK_MIN * 60)
        intervalRef.current = setInterval(() => {
          setSecondsLeft((s) => {
            if (s <= 1) return 0
            return s - 1
          })
        }, 1000)
      } else if (state === 'break') {
        stopInterval()
        setState('idle')
        setSecondsLeft(FOCUS_MIN * 60)
        beep()
      }
    }
  }, [secondsLeft, state, pomodoros, stopInterval])

  useEffect(() => {
    return () => stopInterval()
  }, [stopInterval])

  const handlePause = () => {
    if (state === 'focus' || state === 'break') {
      stopInterval()
      setState('idle')
      setTotalFocusSec((prev) => prev + focusSecRef.current)
      focusSecRef.current = 0
    }
  }

  const handleReset = () => {
    stopInterval()
    setState('idle')
    setSecondsLeft(FOCUS_MIN * 60)
    focusSecRef.current = 0
  }

  const handleSalvar = () => {
    stopInterval()
    const totalMin = Math.round((totalFocusSec + focusSecRef.current) / 60)
    onComplete(Math.max(totalMin, 1), pomodoros)
  }

  const minutos = Math.floor(secondsLeft / 60)
  const segundos = secondsLeft % 60
  const tempoStr = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`

  return (
    <div className="space-y-4">
      {/* Estado atual */}
      <div className="flex items-center gap-2">
        {state === 'break' ? (
          <><HugeiconsIcon icon={Coffee01Icon} size={16} className="text-green-400" /><span className="text-sm text-green-400 font-medium">Pausa</span></>
        ) : state === 'focus' ? (
          <><div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /><span className="text-sm text-red-400 font-medium">Focando</span></>
        ) : (
          <span className="text-sm text-zinc-500">Pronto para começar</span>
        )}
        {pomodoros > 0 && (
          <span className="ml-auto text-xs text-zinc-500">{pomodoros} 🍅</span>
        )}
      </div>

      {/* Timer display */}
      <div className="text-center">
        <span className="text-6xl font-mono font-bold text-white tabular-nums">{tempoStr}</span>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Controles */}
      <div className="flex gap-2 justify-center">
        {state === 'idle' ? (
          <Button onClick={startFocus} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
            <HugeiconsIcon icon={PlayIcon} size={16} />
            {pomodoros > 0 ? 'Novo pomodoro' : 'Iniciar'}
          </Button>
        ) : (
          <Button onClick={handlePause} variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-2">
            <HugeiconsIcon icon={PauseIcon} size={16} />
            Pausar
          </Button>
        )}
        <Button onClick={handleReset} variant="ghost" className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800">
          <HugeiconsIcon icon={RefreshIcon} size={16} />
        </Button>
      </div>

      {/* Botão salvar (sempre visível) */}
      {(pomodoros > 0 || state === 'idle') && (
        <Button
          onClick={handleSalvar}
          variant="outline"
          className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm"
        >
          Finalizar e salvar sessão
        </Button>
      )}
    </div>
  )
}
