import { fsrs, generatorParameters, Rating, createEmptyCard, type Card, type Grade } from 'ts-fsrs'

const f = fsrs(generatorParameters({ enable_fuzz: true }))

export { createEmptyCard, type Card }

export function processReview(card: Card, rating: 'again' | 'hard' | 'good' | 'easy') {
  const ratingMap: Record<string, Grade> = {
    again: Rating.Again as Grade,
    hard: Rating.Hard as Grade,
    good: Rating.Good as Grade,
    easy: Rating.Easy as Grade,
  }
  const result = f.next(card, new Date(), ratingMap[rating])
  return result.card
}
