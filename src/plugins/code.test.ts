import { describe, expect, expectTypeOf, it } from 'bun:test'
import { Error0 } from '../index.js'
import { codePlugin } from './code.js'

describe('codePlugin', () => {
  const codes = ['NOT_FOUND', 'BAD_REQUEST', 'UNAUTHORIZED'] as const

  it('serializes and deserializes allowed codes', () => {
    const AppError = Error0.use(codePlugin({ codes: [...codes] }))
    const error = new AppError('test', { code: 'NOT_FOUND' })

    expect(error.code).toBe('NOT_FOUND')
    expectTypeOf<typeof error.code>().toEqualTypeOf<'NOT_FOUND' | 'BAD_REQUEST' | 'UNAUTHORIZED' | undefined>()

    const json = AppError.serialize(error, false)
    expect(json.code).toBe('NOT_FOUND')

    const recreated = AppError.from(json)
    expect(recreated.code).toBe('NOT_FOUND')
  })

  it('ignores code values outside the allowed list', () => {
    const AppError = Error0.use(codePlugin({ codes: [...codes] }))
    const recreated = AppError.from({ message: 'test', code: 'SOMETHING_ELSE' })
    expect(recreated.code).toBeUndefined()
  })
})
