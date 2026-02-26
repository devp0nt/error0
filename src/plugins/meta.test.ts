import { describe, expect, it } from 'bun:test'
import { Error0 } from '../index.js'
import { metaPlugin } from './meta.js'

describe('metaPlugin', () => {
  it('merges meta across causes into current error', () => {
    const AppError = Error0.use(metaPlugin())
    const root = new AppError('root', { meta: { requestId: 'r1', source: 'db' } })
    const leaf = new AppError('leaf', { meta: { route: '/ideas', source: 'api' }, cause: root })
    expect(leaf.resolve().meta).toEqual({
      requestId: 'r1',
      source: 'api',
      route: '/ideas',
    })
  })

  it('serializes meta only for private output and keeps json-safe values', () => {
    const AppError = Error0.use(metaPlugin())
    const error = new AppError('test', {
      meta: {
        ok: true,
        nested: { id: 1 },
        skip: () => 'x',
      },
    })
    expect(AppError.serialize(error, false).meta).toEqual({
      ok: true,
      nested: { id: 1 },
    })
    expect('meta' in AppError.serialize(error, true)).toBe(false)
  })
})
