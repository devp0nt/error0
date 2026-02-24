import { describe, expect, expectTypeOf, it } from 'bun:test'
import type { ClassError0 } from './index.js'
import { Error0 } from './index.js'

const fixStack = (stack: string | undefined) => {
  if (!stack) {
    return stack
  }
  // at <anonymous> (/Users/x/error0.test.ts:103:25)
  // ↓
  // at <anonymous> (...)
  const lines = stack.split('\n')
  const fixedLines = lines.map((line) => {
    const withoutPath = line.replace(/\(.*\)$/, '(...)')
    return withoutPath
  })
  return fixedLines.join('\n')
}

describe('Error0', () => {
  const statusExtension = Error0.extension({
    props: {
      status: {
        setter: (value: number) => value,
        getter: (error) => {
          for (const value of error.flow('status')) {
            const status = Number(value)
            if (!Number.isNaN(status)) {
              return status
            }
          }
          return undefined
        },
        serialize: (value) => value,
      },
    },
    methods: {
      isStatus: (error, status: number) => error.flow('status').some((value) => value === status),
    },
  })

  const codeExtension = Error0.extension({
    props: {
      code: {
        setter: (value: string) => value,
        getter: (error) => {
          for (const value of error.flow('code')) {
            if (typeof value === 'string') {
              return value
            }
          }
          return undefined
        },
        serialize: (value, isPublic) => (isPublic ? undefined : value),
      },
    },
  })

  it('simple', () => {
    const error = new Error0('test')
    expect(error).toBeInstanceOf(Error0)
    expect(error).toBeInstanceOf(Error)
    expect(error).toMatchInlineSnapshot(`[Error0: test]`)
    expect(error.message).toBe('test')
    expect(error.stack).toBeDefined()
    expect(fixStack(error.stack)).toMatchInlineSnapshot(`
      "Error0: test
          at <anonymous> (...)"
    `)
  })

  it('with object extension', () => {
    const AppError = Error0.extend({
      props: {
        status: {
          setter: (value: number) => value,
          getter: (error: Error0) => {
            for (const value of error.flow('status')) {
              const status = Number(value)
              if (!Number.isNaN(status)) {
                return status
              }
            }
            return undefined
          },
          serialize: (value: number | undefined) => value,
        },
      },
    })
    const error = new AppError('test', { status: 400 })
    expect(error).toBeInstanceOf(AppError)
    expect(error).toBeInstanceOf(Error0)
    expect(error).toBeInstanceOf(Error)
    expect(error.status).toBe(400)
    expect(error).toMatchInlineSnapshot(`[Error0: test]`)
    expect(error.stack).toBeDefined()
    expect(fixStack(error.stack)).toMatchInlineSnapshot(`
      "Error0: test
          at <anonymous> (...)"
    `)
    expectTypeOf<typeof AppError>().toExtend<ClassError0>()
  })

  it('with defined extension', () => {
    const AppError = Error0.extend(statusExtension)
    const error = new AppError('test', { status: 400 })
    expect(error).toBeInstanceOf(AppError)
    expect(error).toBeInstanceOf(Error0)
    expect(error).toBeInstanceOf(Error)
    expect(error.status).toBe(400)
    expect(error).toMatchInlineSnapshot(`[Error0: test]`)
    expect(error.stack).toBeDefined()
    expect(fixStack(error.stack)).toMatchInlineSnapshot(`
      "Error0: test
          at <anonymous> (...)"
    `)
  })

  it('twice extended Error0 extends previous by types', () => {
    const AppError1 = Error0.extend(statusExtension)
    const AppError2 = AppError1.extend(codeExtension)
    const error1 = new AppError1('test', { status: 400 })
    const error2 = new AppError2('test', { status: 400, code: 'code1' })
    expect(error1.status).toBe(400)
    expect(error2.status).toBe(400)
    expect(error2.code).toBe('code1')
    expectTypeOf<typeof AppError1>().toExtend<ClassError0>()
    expectTypeOf<typeof AppError2>().toExtend<ClassError0>()
    expectTypeOf<typeof AppError2>().toExtend<typeof AppError1>()
    expectTypeOf<typeof AppError1>().not.toExtend<typeof AppError2>()
  })

  it('can have cause', () => {
    const AppError = Error0.extend(statusExtension)
    const anotherError = new Error('another error')
    const error = new AppError('test', { status: 400, cause: anotherError })
    expect(error.status).toBe(400)
    expect(error).toMatchInlineSnapshot(`[Error0: test]`)
    expect(error.stack).toBeDefined()
    expect(fixStack(error.stack)).toMatchInlineSnapshot(`
      "Error0: test
          at <anonymous> (...)"
    `)
    expect(Error0.causes(error)).toEqual([error, anotherError])
  })

  it('can have many causes', () => {
    const AppError = Error0.extend(statusExtension)
    const anotherError = new Error('another error')
    const error1 = new AppError('test1', { status: 400, cause: anotherError })
    const error2 = new AppError('test2', { status: 400, cause: error1 })
    expect(error1.status).toBe(400)
    expect(error2.status).toBe(400)
    expect(Error0.causes(error2)).toEqual([error2, error1, anotherError])
  })

  it('properties floating', () => {
    const AppError = Error0.extend(statusExtension).extend(codeExtension)
    const anotherError = new Error('another error')
    const error1 = new AppError('test1', { status: 400, cause: anotherError })
    const error2 = new AppError('test2', { code: 'code', cause: error1 })
    expect(error1.status).toBe(400)
    expect(error1.code).toBe(undefined)
    expect(error2.status).toBe(400)
    expect(error2.code).toBe('code')
    expect(Error0.causes(error2)).toEqual([error2, error1, anotherError])
  })

  it('serialize uses identity by default and skips undefined extension values', () => {
    const AppError = Error0.extend(statusExtension).extend({
      props: {
        code: {
          setter: (value: string) => value,
          getter: (error) => {
            for (const value of error.flow('code')) {
              if (typeof value === 'string') {
                return value
              }
            }
            return undefined
          },
          serialize: () => undefined,
        },
      },
    })
    const error = new AppError('test', { status: 401, code: 'secret' })
    const json = AppError.serialize(error) as Record<string, unknown>
    expect(json.status).toBe(401)
    expect('code' in json).toBe(false)
  })

  it('serialize keeps stack by default without stack extension', () => {
    const AppError = Error0.extend(statusExtension)
    const error = new AppError('test', { status: 500 })
    const json = AppError.serialize(error) as Record<string, unknown>
    expect(json.stack).toBe(error.stack)
  })

  it('stack extension can customize serialization', () => {
    const AppError = Error0.extend({
      props: {
        stack: {
          setter: (value: string) => value,
          getter: (error: Error0) => error.own('stack'),
          serialize: () => undefined,
        },
      },
      computed: {},
      methods: {},
    })
    const error = new AppError('test')
    const json = AppError.serialize(error) as Record<string, unknown>
    expect('stack' in json).toBe(false)
  })

  it('.serialize() -> .from() roundtrip keeps extension values', () => {
    const AppError = Error0.extend(statusExtension).extend(codeExtension)
    const error = new AppError('test', { status: 409, code: 'conflict' })
    const json = AppError.serialize(error)
    const recreated = AppError.from(json)
    expect(recreated).toBeInstanceOf(AppError)
    expect(recreated.status).toBe(409)
    expect(recreated.code).toBe('conflict')
    expect(AppError.serialize(recreated)).toEqual(json)
  })

  it('computed values serialize and rich methods work in static/instance modes', () => {
    const AppError = Error0.extend(statusExtension)
      .extend(codeExtension)
      .extend({
        props: {},
        computed: {
          summary: (error: Error0) => {
            const code = error.flow('code').find((value: unknown) => typeof value === 'string')
            return `${error.message}:${code ?? 'none'}`
          },
        },
        methods: {
          hasCode: (error: Error0, expectedCode: unknown) =>
            error.flow('code').some((value: unknown) => value === expectedCode),
        },
      })

    const error = new AppError('test', { status: 400, code: 'E400' })
    expect(error.summary).toBe('test:E400')
    expect(error.hasCode('E400')).toBe(true)
    expect(AppError.hasCode(error, 'E400')).toBe(true)
    expect(AppError.serialize(error)).toMatchObject({ summary: 'test:E400' })
  })

  it('serialize can hide props for public output', () => {
    const AppError = Error0.extend(statusExtension).extend(codeExtension)
    const error = new AppError('test', { status: 401, code: 'SECRET' })
    const privateJson = AppError.serialize(error, false) as Record<string, unknown>
    const publicJson = AppError.serialize(error, true) as Record<string, unknown>
    expect(privateJson.code).toBe('SECRET')
    expect('code' in publicJson).toBe(false)
  })
})
