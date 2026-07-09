import { describe, expect, it } from 'vitest'

import { err, ok, type Result } from './index.js'

describe('@ministack/shared Result helpers', () => {
  it('ok() wraps a success value', () => {
    const result: Result<number> = ok(42)
    expect(result).toEqual({ ok: true, value: 42 })
  })

  it('err() wraps an error value', () => {
    const error = new Error('boom')
    const result: Result<number> = err(error)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe(error)
    }
  })
})
