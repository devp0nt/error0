import { describe, expect, it } from 'bun:test'
import { Error0 } from '../index.js'
import { headersPlugin } from './headers.js'

describe('headersPlugin', () => {
  it('accepts headers in constructor input and exposes it on error instance', () => {
    const AppError = Error0.use(headersPlugin())
    const headers = { 'x-request-id': 'abc123', 'content-type': 'application/json' }

    const error = new AppError('http error', { headers })

    expect(error.headers).toEqual(headers)
  })

  it('not loose headers after ,from()', () => {
    const AppError = Error0.use(headersPlugin())
    const headers = { 'x-request-id': 'abc123', 'content-type': 'application/json' }

    const error = AppError.from(new AppError('http error', { headers }))

    expect(error.headers).toEqual(headers)
  })

  it('can be found in flow', () => {
    const AppError = Error0.use(headersPlugin())
    const headers = { 'x-request-id': 'abc123' }

    const error1 = new AppError('http error', { headers })
    const error2 = new AppError('http error', { cause: error1 })

    expect(error1.headers).toEqual(headers)
    expect(error2.headers).toEqual(headers)
  })

  it('merges headers from nested causes and keeps nearest override', () => {
    const AppError = Error0.use(headersPlugin())
    const error1 = new AppError('base', {
      headers: { 'x-base': '1', 'x-shared': 'base' },
    })
    const error2 = new AppError('middle', {
      headers: { 'x-middle': '2', 'x-shared': 'middle' },
      cause: error1,
    })
    const error3 = new AppError('top', {
      headers: { 'x-top': '3' },
      cause: error2,
    })

    expect(error3.headers).toEqual({
      'x-base': '1',
      'x-middle': '2',
      'x-top': '3',
      'x-shared': 'middle',
    })
  })

  it('merges headers from nested causes and keeps nearest override with undefined', () => {
    const AppError = Error0.use(headersPlugin())
    const error1 = new AppError('base', {
      headers: { 'x-base': '1', 'x-shared': 'base' },
    })
    const error2 = new AppError('middle', {
      headers: { 'x-middle': '2', 'x-shared': 'middle' },
      cause: error1,
    })
    const error3 = new AppError('top', {
      headers: { 'x-top': '3', 'x-shared': undefined },
      cause: error2,
    })

    expect(error3.headers).toEqual({
      'x-base': '1',
      'x-middle': '2',
      'x-top': '3',
      'x-shared': undefined,
    })
  })

  it('overwrites inherited header with undefined when explicitly set', () => {
    const AppError = Error0.use(headersPlugin())
    const error1 = new AppError('base', {
      headers: { authorization: 'Bearer token', 'x-base': '1' },
    })
    const error2 = new AppError('top', { cause: error1 }).assign({
      // Runtime overwrite marker to unset inherited header.
      headers: { authorization: undefined } as unknown as Record<string, string>,
    })

    expect(error2.headers).toEqual({
      'x-base': '1',
      authorization: undefined,
    })
  })

  it('does not serialize headers', () => {
    const AppError = Error0.use(headersPlugin())
    const error = new AppError('http error', {
      headers: { 'content-type': 'application/json' },
    })

    const json = AppError.serialize(error, false)
    expect('headers' in json).toBe(false)
  })

  it('does not deserialize headers', () => {
    const AppError = Error0.use(headersPlugin())
    const recreated = AppError.from({
      message: 'serialized',
      headers: { 'content-type': 'application/json' },
    })

    expect(recreated.headers).toBeUndefined()
  })

  it('rejects non-record constructor input by types', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const AppError = Error0.use(headersPlugin())
    // @ts-expect-error - headers must be Record<string, string>
    const input: ConstructorParameters<typeof AppError>[1] = { headers: 123 }
    expect(input).toBeDefined()
  })
})
