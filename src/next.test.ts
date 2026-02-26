import { describe, expect, it } from 'bun:test'
import { ErrorProp, NextError0 } from './next.js'

type AppErrorInput = {
  status?: number
  code?: string
  cause?: unknown
}

class AppError extends NextError0 {
  @ErrorProp<number>({
    resolve: ({ own, flow, error }) => {
      if (typeof own === 'number') {
        return own
      }
      return flow.find((value) => typeof value === 'number')
    },
    serialize: ({ resolved }) => resolved,
    deserialize: ({ value }) => (typeof value === 'number' ? value : undefined),
  })
  declare status?: number

  @ErrorProp<string>({
    resolve: ({ own }) => own,
    serialize: ({ resolved }) => resolved,
    deserialize: ({ value }) => (typeof value === 'string' ? value : undefined),
  })
  declare code?: string

  constructor(message: string, input?: AppErrorInput)
  constructor(input: { message: string } & AppErrorInput)
  constructor(...args: [message: string, input?: AppErrorInput] | [{ message: string } & AppErrorInput]) {
    const [first, second] = args
    const input = typeof first === 'string' ? { message: first, ...(second ?? {}) } : first
    super(input)
  }
}

class TransportError extends NextError0 {
  constructor(message: string, input?: { cause?: unknown })
  constructor(input: { message: string; cause?: unknown })
  constructor(...args: [message: string, input?: { cause?: unknown }] | [{ message: string; cause?: unknown }]) {
    const [first, second] = args
    const input = typeof first === 'string' ? { message: first, ...(second ?? {}) } : first
    super(input)
  }
}

describe('NextError0 decorator-only experiment', () => {
  it.only('uses own() for raw decorated value and resolve() for property', () => {
    const root = new AppError('root', { status: 400 })
    const leaf = new AppError('leaf', { cause: root })
    expect(leaf.status).toBe(400)
    console.error(leaf)
    expect(leaf.own('status')).toBe(undefined)
    expect(leaf.flow('status')).toEqual([undefined, 400])
  })

  it('defined decorator properties are regular own properties', () => {
    const error = new AppError('inspect', { status: 418, code: 'TEAPOT' })
    expect(Object.prototype.hasOwnProperty.call(error, 'status')).toBe(true)
    expect(Object.prototype.hasOwnProperty.call(error, 'code')).toBe(true)
    expect(Object.keys(error)).toContain('status')
    expect(Object.keys(error)).toContain('code')
  })

  it('serialize traverses causes that are NextError0 instances', () => {
    const root = new AppError('root', { status: 401 })
    const middle = new TransportError('middle', { cause: root })
    const leaf = new AppError('leaf', { code: 'LEAF', cause: middle })

    const json = leaf.serialize(false)
    expect(json).toMatchObject({
      name: 'NextError0',
      message: 'leaf',
      status: 401,
      code: 'LEAF',
      cause: {
        name: 'NextError0',
        message: 'middle',
        cause: {
          name: 'NextError0',
          message: 'root',
          status: 401,
        },
      },
    })
  })

  it('from(serialize()) keeps decorated own values and cause chain', () => {
    const root = new AppError('root', { status: 404 })
    const leaf = new AppError('leaf', { code: 'LEAF', cause: root })

    const recreated = AppError.from(leaf.serialize(false))
    expect(recreated).toBeInstanceOf(AppError)
    expect(recreated.status).toBe(404)
    expect(recreated.code).toBe('LEAF')
    expect(recreated.cause).toBeInstanceOf(AppError)
    expect((recreated.cause as AppError).status).toBe(404)
  })
})
