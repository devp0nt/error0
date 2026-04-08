import { describe, expect, expectTypeOf, it } from 'bun:test'
import { Error0 } from '../index.js'
import { responsePlugin } from './response.js'

describe('responsePlugin', () => {
  it('accepts Response in constructor input and exposes it on error instance', () => {
    const AppError = Error0.use(responsePlugin())
    const response = new Response('teapot', { status: 418 })

    const error = new AppError('http error', { response })

    expect(error.response).toBe(response)
    expect(error.response?.status).toBe(418)
    expectTypeOf<typeof error.response>().toEqualTypeOf<Response | undefined>()
  })

  it('not loose reponse after ,from()', () => {
    const AppError = Error0.use(responsePlugin())
    const response = new Response('teapot', { status: 418 })

    const error = AppError.from(new AppError('http error', { response }))

    expect(error.response).toBe(response)
    expect(error.response?.status).toBe(418)
    expectTypeOf<typeof error.response>().toEqualTypeOf<Response | undefined>()
  })

  it('can be found in flow', () => {
    const AppError = Error0.use(responsePlugin())
    const response = new Response('teapot', { status: 418 })

    const error1 = new AppError('http error', { response })
    const error2 = new AppError('http error', { cause: error1 })

    expect(error1.response).toBe(response)
    expect(error1.response?.status).toBe(418)
    expectTypeOf<typeof error1.response>().toEqualTypeOf<Response | undefined>()
    expect(error2.response).toBe(response)
    expect(error2.response?.status).toBe(418)
    expectTypeOf<typeof error2.response>().toEqualTypeOf<Response | undefined>()
  })

  it('does not serialize response', () => {
    const AppError = Error0.use(responsePlugin())
    const error = new AppError('http error', {
      response: new Response('ok', { status: 200 }),
    })

    const json = AppError.serialize(error, false)
    expect('response' in json).toBe(false)
  })

  it('does not deserialize response', () => {
    const AppError = Error0.use(responsePlugin())
    const response = new Response('ok', { status: 200 })
    const recreated = AppError.from({
      message: 'serialized',
      response,
    })

    expect(recreated.response).toBeUndefined()
  })

  it('rejects non-Response constructor input by types', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const AppError = Error0.use(responsePlugin())
    // @ts-expect-error - response must be Response
    const input: ConstructorParameters<typeof AppError>[1] = { response: 123 }
    expect(input).toBeDefined()
  })
})
