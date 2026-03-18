'use client'
import { Emoji } from 'react-apple-emojis'

interface AppleEmojiProps {
  name: string
  width?: number
  className?: string
}

export function AppleEmoji({ name, width = 24, className }: AppleEmojiProps) {
  return <Emoji name={name} width={width} className={className} />
}
