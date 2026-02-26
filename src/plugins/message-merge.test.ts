import { describe, expect, it } from 'bun:test'
import { Error0 } from '../index.js'
import { messageMergePlugin } from './message-merge.js'

describe('messageMergePlugin', () => {
  const statusPlugin = Error0.plugin().use('prop', 'status', {
    init: (input: number) => input,
    resolve: ({ flow }) => flow.find((value) => typeof value === 'number'),
    serialize: ({ resolved }) => resolved,
    deserialize: ({ value }) => (typeof value === 'number' ? value : undefined),
  })

  const codes = ['NOT_FOUND', 'BAD_REQUEST', 'UNAUTHORIZED'] as const
  type Code = (typeof codes)[number]
  const codePlugin = Error0.plugin().use('prop', 'code', {
    init: (input: Code) => input,
    resolve: ({ flow }) => flow.find((value) => typeof value === 'string' && codes.includes(value)),
    serialize: ({ resolved, isPublic }) => (isPublic ? undefined : resolved),
    deserialize: ({ value }) =>
      typeof value === 'string' && codes.includes(value as Code) ? (value as Code) : undefined,
  })

  it('can merge message across causes in one serialized value', () => {
    const AppError = Error0.use(statusPlugin).use(codePlugin).use(messageMergePlugin)
    const error1 = new AppError('test1', { status: 400, code: 'NOT_FOUND' })
    const error2 = new AppError('test2', { status: 401, cause: error1 })
    expect(error1.message).toBe('test1')
    expect(error2.message).toBe('test2')
    expect(error1.serialize().message).toBe('test1')
    expect(error2.serialize().message).toBe('test2: test1')
  })
})
