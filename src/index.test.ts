import { describe, expect, expectTypeOf, it } from 'bun:test'
import type { ClassError0 } from './index.js'
import { Error0 } from './index.js'
import z, { ZodError } from 'zod'
import * as assert from 'node:assert'

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
  const statusExtension = Error0.extension()
    .prop('status', {
      input: (value: number) => value,
      output: (error) => {
        for (const value of error.flow('status')) {
          const status = Number(value)
          if (!Number.isNaN(status)) {
            return status
          }
        }
        return undefined
      },
      serialize: (value) => value,
    })
    .method('isStatus', (error, status: number) => error.status === status)

  const codes = ['NOT_FOUND', 'BAD_REQUEST', 'UNAUTHORIZED'] as const
  type Code = (typeof codes)[number]
  const codeExtension = Error0.extension().extend('prop', 'code', {
    input: (value: Code) => value,
    output: (error) => {
      for (const value of error.flow('code')) {
        if (typeof value === 'string') {
          if (codes.includes(value as Code)) {
            return value as Code
          }
        }
      }
      return undefined
    },
    serialize: (value, isPublic) => (isPublic ? undefined : value),
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

  it('with direct prop extension', () => {
    const AppError = Error0.extend('prop', 'status', {
      input: (value: number) => value,
      output: (error: Error0) => {
        for (const value of error.flow('status')) {
          const status = Number(value)
          if (!Number.isNaN(status)) {
            return status
          }
        }
        return undefined
      },
      serialize: (value: number | undefined) => value,
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
    const error2 = new AppError2('test', { status: 400, code: 'NOT_FOUND' })
    expect(error1.status).toBe(400)
    expect(error2.status).toBe(400)
    expect(error2.code).toBe('NOT_FOUND')
    expectTypeOf<typeof error2.status>().toEqualTypeOf<number | undefined>()
    expectTypeOf<typeof error2.code>().toEqualTypeOf<'NOT_FOUND' | 'BAD_REQUEST' | 'UNAUTHORIZED' | undefined>()
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
    const error2 = new AppError('test2', { code: 'NOT_FOUND', cause: error1 })
    expect(error1.status).toBe(400)
    expect(error1.code).toBe(undefined)
    expect(error2.status).toBe(400)
    expect(error2.code).toBe('NOT_FOUND')
    expect(Error0.causes(error2)).toEqual([error2, error1, anotherError])
  })

  it('serialize uses identity by default and skips undefined extension values', () => {
    const AppError = Error0.extend(statusExtension).extend('prop', 'code', {
      input: (value: string) => value,
      output: (error) => {
        for (const value of error.flow('code')) {
          if (typeof value === 'string') {
            return value
          }
        }
        return undefined
      },
      serialize: () => undefined,
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

  it('stack extension can customize serialization of stack prop', () => {
    const AppError = Error0.extend('prop', 'stack', {
      input: (value: string) => value,
      output: (error: Error0) => {
        const stack = error.own('stack')
        if (typeof stack === 'string') {
          return stack
        }
        return undefined
      },
      serialize: () => undefined,
    })
    const error = new AppError('test')
    const json = AppError.serialize(error) as Record<string, unknown>
    expect('stack' in json).toBe(false)
  })

  it('.serialize() -> .from() roundtrip keeps extension values', () => {
    const AppError = Error0.extend(statusExtension).extend(codeExtension)
    const error = new AppError('test', { status: 409, code: 'NOT_FOUND' })
    const json = AppError.serialize(error, false)
    const recreated = AppError.from(json)
    expect(recreated).toBeInstanceOf(AppError)
    expect(recreated.status).toBe(409)
    expect(recreated.code).toBe('NOT_FOUND')
    expect(AppError.serialize(recreated, false)).toEqual(json)
  })

  it('computed values and rich methods work in static/instance modes', () => {
    const AppError = Error0.extend(statusExtension)
      .extend(codeExtension)
      .extend('computed', 'summary', (error) => {
        return `${error.message}:${error.code ?? 'none'}`
      })
      .extend('method', 'hasCode', (error, expectedCode: string) => error.code === expectedCode)

    const error = new AppError('test', { status: 400, code: 'NOT_FOUND' })
    expect(error.summary).toBe('test:NOT_FOUND')
    expect(error.hasCode('NOT_FOUND')).toBe(true)
    expect(AppError.hasCode(error, 'NOT_FOUND')).toBe(true)
    expect(AppError.hasCode('just string', 'NOT_FOUND')).toBe(false)
    expect('summary' in AppError.serialize(error)).toBe(false)
  })

  it('serialize can hide props for public output', () => {
    const AppError = Error0.extend(statusExtension).extend(codeExtension)
    const error = new AppError('test', { status: 401, code: 'NOT_FOUND' })
    const privateJson = AppError.serialize(error, false) as Record<string, unknown>
    const publicJson = AppError.serialize(error, true) as Record<string, unknown>
    expect(privateJson.code).toBe('NOT_FOUND')
    expect('code' in publicJson).toBe(false)
  })

  it('by default error0 created from another error has same message', () => {
    const schema = z.object({
      x: z.string(),
    })
    const parseResult = schema.safeParse({ x: 123 })
    const parsedError = parseResult.error
    assert.ok(parsedError)
    const error = Error0.from(parsedError)
    expect(error.message).toBe(parsedError.message)
  })

  it('refine message and other props via direct transformations', () => {
    const schema = z.object({
      x: z.string(),
    })
    const parseResult = schema.safeParse({ x: 123 })
    const parsedError = parseResult.error
    assert.ok(parsedError)
    const AppError = Error0.extend(statusExtension)
      .extend(codeExtension)
      .extend('refine', (error) => {
        if (error.cause instanceof ZodError) {
          error.status = 422
          error.code = 'NOT_FOUND'
          error.message = `Validation Error: ${error.message}`
        }
      })
    const error = AppError.from(parsedError)
    expect(error.message).toBe(`Validation Error: ${parsedError.message}`)
    expect(error.status).toBe(422)
    expect(error.code).toBe('NOT_FOUND')
    const error1 = new AppError('test', { cause: parsedError })
    expect(error1.message).toBe('test')
    expect(error1.status).toBe(undefined)
    expect(error1.code).toBe(undefined)
  })

  it('refine message and other props via return output values from extension', () => {
    const schema = z.object({
      x: z.string(),
    })
    const parseResult = schema.safeParse({ x: 123 })
    const parsedError = parseResult.error
    assert.ok(parsedError)
    const AppError = Error0.extend(statusExtension)
      .extend(codeExtension)
      .extend('refine', (error) => {
        if (error.cause instanceof ZodError) {
          error.message = `Validation Error: ${error.message}`
          return {
            status: 422,
            code: 'NOT_FOUND',
          }
        }
        return undefined
      })
    const error = AppError.from(parsedError)
    expect(error.message).toBe(`Validation Error: ${parsedError.message}`)
    expect(error.status).toBe(422)
    expect(error.code).toBe('NOT_FOUND')
    const error1 = new AppError('test', { cause: parsedError })
    expect(error1.message).toBe('test')
    expect(error1.status).toBe(undefined)
    expect(error1.code).toBe(undefined)
  })

  it('expected prop can be realized to send or not to send error to your error tracker', () => {
    const AppError = Error0.extend(statusExtension)
      .extend('prop', 'expected', {
        input: (value: boolean) => value,
        output: (error) => {
          for (const value of error.flow('expected')) {
            if (typeof value === 'boolean') {
              return value
            }
          }
          return undefined
        },
        serialize: (value) => value,
      })
      .extend('method', 'isExpected', (error) => {
        return error.expected || false
      })
    const errorExpected = new AppError('test', { status: 400, expected: true })
    const errorUnexpected = new AppError('test', { status: 400, expected: false })
    const usualError = new Error('test')
    const errorFromUsualError = AppError.from(usualError)
    const errorWithExpectedErrorAsCause = new AppError('test', { status: 400, cause: errorExpected })
    const errorWithUnexpectedErrorAsCause = new AppError('test', { status: 400, cause: errorUnexpected })
    expect(errorExpected.expected).toBe(true)
    expect(errorUnexpected.expected).toBe(false)
    expect(AppError.isExpected(usualError)).toBe(false)
    expect(errorFromUsualError.expected).toBe(undefined)
    expect(errorFromUsualError.isExpected()).toBe(false)
    expect(errorWithExpectedErrorAsCause.expected).toBe(true)
    expect(errorWithExpectedErrorAsCause.isExpected()).toBe(true)
    expect(errorWithUnexpectedErrorAsCause.expected).toBe(false)
    expect(errorWithUnexpectedErrorAsCause.isExpected()).toBe(false)
  })

  // we will have no variants
  // becouse you can thorw any errorm and when you do AppError.from(yourError)
  // can use refine to assign desired props to error, it is enough for transport
  // you even can create computed or method to retrieve your error, so no problems with variants
  // it('can create and recongnize variant', () => {
  //   const AppError = Error0.extend(statusExtension)
  //     .extend(codeExtension)
  //     .extend('prop', 'userId', {
  //       input: (value: string) => value,
  //       output: (error) => {
  //         for (const value of error.flow('userId')) {
  //           if (typeof value === 'string') {
  //             return value
  //           }
  //         }
  //         return undefined
  //       },
  //       serialize: (value) => value,
  //     })
  //   const UserError = AppError.variant('UserError', {
  //     userId: true,
  //   })
  //   const error = new UserError('test', { userId: '123', status: 400 })
  //   expect(error).toBeInstanceOf(UserError)
  //   expect(error).toBeInstanceOf(AppError)
  //   expect(error).toBeInstanceOf(Error0)
  //   expect(error).toBeInstanceOf(Error)
  //   expect(error.userId).toBe('123')
  //   expect(error.status).toBe(400)
  //   expect(error.code).toBe(undefined)
  //   expectTypeOf<typeof error.userId>().toEqualTypeOf<string>()
  //   // @ts-expect-error
  //   new UserError('test')
  // })
})
