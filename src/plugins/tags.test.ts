import { describe, expect, expectTypeOf, it } from 'bun:test'
import { Error0 } from '../index.js'
import { tagsPlugin } from './tags.js'

describe('tagsPlugin', () => {
  const tags = ['api', 'db', 'retry'] as const

  it('merges and deduplicates tags across causes', () => {
    const AppError = Error0.use(tagsPlugin())
    const root = new AppError('root', { tags: ['db', 'retry'] })
    const leaf = new AppError('leaf', { tags: ['api', 'retry'], cause: root })
    expect(leaf.tags).toEqual(['api', 'retry', 'db'])
    expectTypeOf(leaf.tags).toEqualTypeOf<string[] | undefined>()
    expectTypeOf(leaf.own('tags')).toEqualTypeOf<string[] | undefined>()
    expectTypeOf(leaf.flow('tags')).toEqualTypeOf<Array<string[] | undefined>>()
  })

  it('serializes tags only for private output', () => {
    const AppError = Error0.use(tagsPlugin())
    const error = new AppError('test', { tags: ['internal'] })
    expect(AppError.serialize(error, false).tags).toEqual(['internal'])
    expect('tags' in AppError.serialize(error, true)).toBe(false)
  })

  it('supports hasTag for single, some, and every checks', () => {
    const AppError = Error0.use(tagsPlugin())
    const root = new AppError('root', { tags: ['db', 'retry'] })
    const leaf = new AppError('leaf', { tags: ['api'], cause: root })

    expect(AppError.hasTag(leaf, 'db')).toBe(true)
    expect(leaf.hasTag('db')).toBe(true)
    expect(leaf.hasTag('unknown')).toBe(false)
    expect(leaf.hasTag(['api', 'db'], 'some')).toBe(true)
    expect(leaf.hasTag(['api', 'db'], 'every')).toBe(true)
    expect(leaf.hasTag(['api', 'unknown'], 'every')).toBe(false)
  })

  it('filters tags not in the allow-list when strict is true', () => {
    const AppError = Error0.use(tagsPlugin({ tags: [...tags], strict: true }))
    const recreated = AppError.from({
      name: 'Error0',
      message: 'test',
      tags: ['db', 'invalid', 123],
    })
    expect(recreated.tags).toEqual(['db'])
  })

  it('keeps all string tags when strict is false', () => {
    const AppError = Error0.use(tagsPlugin({ tags: [...tags], strict: false }))
    const recreated = AppError.from({
      name: 'Error0',
      message: 'test',
      tags: ['db', 'custom', 123],
    })
    expect(recreated.tags).toEqual(['db', 'custom'])
  })

  it('enforces typed hasTag inputs when allow-list is provided', () => {
    const AppError = Error0.use(tagsPlugin({ tags }))
    const error = new AppError('test', { tags: ['api', 'db'] })

    expectTypeOf(error.hasTag('api')).toEqualTypeOf<boolean>()
    expectTypeOf(error.hasTag(['api', 'db'], 'every')).toEqualTypeOf<boolean>()
    expectTypeOf(error.hasTag(['api', 'retry'], 'some')).toEqualTypeOf<boolean>()

    // @ts-expect-error - unknown tag is not part of allow-list
    error.hasTag('custom')
    // @ts-expect-error - array checks require policy argument
    error.hasTag(['api', 'db'])
    // @ts-expect-error - unsupported policy
    error.hasTag(['api', 'db'], 'all')
  })
})
