import { describe, expect, expectTypeOf, it } from 'bun:test'
import { Error0 } from '../index.js'
import { statusPlugin } from './status.js'

describe('statusPlugin', () => {
  const statuses = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
  } as const

  it('maps status keys to numeric values', () => {
    const AppError = Error0.use(statusPlugin({ statuses }))
    const error = new AppError('test', { status: 'NOT_FOUND' })

    expectTypeOf<typeof error.status>().toEqualTypeOf<number | undefined>()
    expect(error.status).toBe(404)

    const json = AppError.serialize(error, false)
    expect(json.status).toBe(404)
  })

  it('accepts numeric status values when no statuses map is provided', () => {
    const AppError = Error0.use(statusPlugin())
    const error = new AppError('test', { status: 500 })
    expect(error.status).toBe(500)
  })

  it('if status number not in list, it is not converts to undefined by default', () => {
    const AppError = Error0.use(statusPlugin({ statuses }))
    const error = new AppError('test', { status: 999 })
    expect(error.status).toBe(999)
  })

  it('if status number not in list, it converts to undefined if strict is true', () => {
    const AppError = Error0.use(statusPlugin({ statuses, strict: true }))
    const error = new AppError('test', { status: 999 })
    expect(error.status).toBeUndefined()
  })

  it('not allowed incorrect status name', () => {
    const AppError = Error0.use(statusPlugin({ statuses }))
    // @ts-expect-error - incorrect status name
    const error = new AppError('test', { status: 'SOMETHING_ELSE' })
    expect(error.status).toBeUndefined()
  })

  it('not allowed status name if statuses not provided', () => {
    const AppError = Error0.use(statusPlugin())
    // @ts-expect-error - incorrect status name
    const error = new AppError('test', { status: 'SOMETHING_ELSE' })
    expect(error.status).toBeUndefined()
  })
})
