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
      key: 'status',
      setter: (value: number) => value,
      getter: (_error, flow) => {
        const status = Number(flow[0])
        if (isNaN(status)) {
          return undefined
        }
        return status
      },
    })
    const error = new AppError('test', { status: 400 })
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
    const statusExtension = Error0.extension({
      key: 'status',
      setter: (value: number) => value,
      getter: (_error, flow) => {
        const status = Number(flow[0])
        if (isNaN(status)) {
          return undefined
        }
        return status
      },
    })
    const AppError = Error0.extend(statusExtension)
    const error = new AppError('test', { status: 400 })
    expect(error.status).toBe(400)
    expect(error).toMatchInlineSnapshot(`[Error0: test]`)
    expect(error.stack).toBeDefined()
    expect(fixStack(error.stack)).toMatchInlineSnapshot(`
      "Error0: test
          at <anonymous> (...)"
    `)
  })

  it('twice extended Error0 extends previous by types', () => {
    const statusExtension = Error0.extension({
      key: 'status',
      setter: (value: number) => value,
      getter: (_error, flow) => {
        const status = Number(flow[0])
        if (isNaN(status)) {
          return undefined
        }
        return status
      },
    })
    const codeExtension = Error0.extension({
      key: 'code',
      setter: (value: string) => value,
      getter: (_error, flow) => {
        if (typeof flow[0] === 'string') {
          return flow[0]
        }
        return undefined
      },
    })
    const AppError1 = Error0.extend(statusExtension)
    const AppError2 = AppError1.extend(codeExtension)
    const error1 = new AppError1('test', { status: 400 })
    const error2 = new AppError2('test', { status: 400 })
    expect(error1.status).toBe(400)
    expect(error2.status).toBe(400)
    expect(error2.code).toBe('code1')

    expectTypeOf<typeof AppError1>().toExtend<ClassError0>()
    expectTypeOf<typeof AppError2>().toExtend<ClassError0>()
    expectTypeOf<typeof AppError2>().toExtend<typeof AppError1>()
    expectTypeOf<typeof AppError1>().not.toExtend<typeof AppError2>()
  })
})

// TODO:
// Генерик в поинте у нас это эррор у которого есть метод фром, ошибки это результат этого фром
// Ключ ретрив, это как при фром добыть поле для инпута
// Разделить плагин для проперти и для парсинга ошибки?
// Статик казес с фильтром
// Тест на то что эррор класс экстендит эррор класс
// on create we just pass things to this, not use setters or getters
// allow pass from
// .from()
// toJson
