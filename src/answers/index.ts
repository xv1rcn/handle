import seedrandom from 'seedrandom'
import { getHint } from '../logic'
import { answers } from './list'

export { answers }

export function getAnswerOfDay(day: number) {
  if (day <= 0)
    return { word: '', hint: '' }

  let answer: string[]
  if (day >= answers.length) {
    const seed = seedrandom(`day-${day}`)()
    answer = answers[Math.floor(seed * answers.length)]
  }
  else {
    answer = answers[day]
  }
  const [word = '', hint = ''] = answer || []
  return {
    word,
    hint: hint || getHint(word),
  }
}
