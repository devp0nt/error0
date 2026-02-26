import { describe, expect, it } from 'bun:test'
import { Error0 } from '../index.js'
import { stackMergePlugin } from './stack-merge.js'

const fixStack = (stack: string | undefined) => {
  if (!stack) {
    return stack
  }
  const lines = stack.split('\n')
  const fixedLines = lines.map((line) => {
    const withoutPath = line.replace(/\(.*\)$/, '(...)')
    return withoutPath
  })
  return fixedLines.join('\n')
}

describe('stackMergePlugin', () => {
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

  it('can merge stack across causes in one serialized value', () => {
    const AppError = Error0.use(statusPlugin).use(codePlugin).use(stackMergePlugin)
    const error1 = new AppError('test1', { status: 400, code: 'NOT_FOUND' })
    const error2 = new AppError('test2', { status: 401, cause: error1 })
    const mergedStack1 = error1.serialize(false).stack as string
    const mergedStack2 = error2.serialize(false).stack as string
    const mergedStack2Public = error2.serialize(true).stack as string | undefined
    expect(mergedStack1).toContain('Error0: test1')
    expect(mergedStack2).toContain('Error0: test2')
    expect(mergedStack2).toContain('Error0: test1')
    expect(fixStack(mergedStack1)).toMatchInlineSnapshot(`
      "Error0: test1
          at <anonymous> (...)"
    `)
    expect(fixStack(mergedStack2)).toMatchInlineSnapshot(`
      "Error0: test2
          at <anonymous> (...)
      Error0: test1
          at <anonymous> (...)"
    `)
    expect(mergedStack2Public).toBeUndefined()
  })

  it('by default serializes stack of this error only', () => {
    const AppError = Error0.use(statusPlugin).use(codePlugin).use(stackMergePlugin)
    const error = new AppError('test', { status: 400, code: 'NOT_FOUND' })
    const json = AppError.serialize(error, false)
    expect(json.stack).toBe(error.stack)
  })
})
