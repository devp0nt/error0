import { describe, expect, expectTypeOf, it } from 'bun:test'
import { Error0 } from '../index.js'
import { tagsPlugin } from './tags.js'

describe('tagsPlugin', () => {
  it('merges and deduplicates tags across causes', () => {
    const AppError = Error0.use(tagsPlugin())
    const root = new AppError('root', { tags: ['db', 'retry'] })
    const leaf = new AppError('leaf', { tags: ['api', 'retry'], cause: root })
    expect(leaf.resolve().tags).toEqual(['api', 'retry', 'db'])
    expectTypeOf(leaf.resolve().tags).toEqualTypeOf<string[] | undefined>()
    expectTypeOf(leaf.own('tags')).toEqualTypeOf<string[] | undefined>()
    expectTypeOf(leaf.flow('tags')).toEqualTypeOf<Array<string[] | undefined>>()
  })

  it('serializes tags only for private output', () => {
    const AppError = Error0.use(tagsPlugin())
    const error = new AppError('test', { tags: ['internal'] })
    expect(AppError.serialize(error, false).tags).toEqual(['internal'])
    expect('tags' in AppError.serialize(error, true)).toBe(false)
  })
})
