import { describe, expect, it } from 'vitest'
import { getAnswerOfDay } from '../src/answers'

describe('getAnswerOfDay', () => {
  it('returns empty answer for non-positive day', () => {
    expect(getAnswerOfDay(0)).toEqual({ word: '', hint: '' })
    expect(getAnswerOfDay(-3)).toEqual({ word: '', hint: '' })
  })

  it('returns stable answer shape for large out-of-range day', () => {
    const result = getAnswerOfDay(99999)
    expect(result.word.length).toBeGreaterThan(0)
    expect(typeof result.hint).toBe('string')
  })
})
