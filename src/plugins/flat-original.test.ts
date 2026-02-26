import { describe, expect, it } from 'bun:test'
import { Error0 } from '../index.js'
import { flatOriginalPlugin } from './flat-original.js'

describe('flatOriginalPlugin', () => {
  it('without plugin original error comes to cause', () => {
    const usualError = new Error('another error')
    const error = Error0.from(usualError)
    expect(error).toBeInstanceOf(Error0)
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('Error0')
    expect(error.cause).not.toBeInstanceOf(Error0)
    expect(error.cause).toBeInstanceOf(Error)
    expect(error.cause).toBe(usualError)
    expect((error.cause as any).name).toBe('Error')
    expect(error.causes()).toEqual([error, usualError])
  })

  it('with plugin original error becomes error0 itself', () => {
    const usualError = new Error('another error')
    const AppError = Error0.use(flatOriginalPlugin())
    const error = AppError.from(usualError)
    expect(error).toBeInstanceOf(AppError)
    expect(error).toBeInstanceOf(Error0)
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe(usualError.message)
    expect(error.stack).toBe(usualError.stack)
    expect(error.name).toBe('Error0')
    expect(error.cause).toBeUndefined()
  })

  it('with plugin original error becomes error0 itself but keep it own causes', () => {
    const causeError = new Error('cause error')
    const usualError = new Error('another error', { cause: causeError })
    const AppError = Error0.use(flatOriginalPlugin())
    const error = AppError.from(usualError)
    expect(error).toBeInstanceOf(AppError)
    expect(error).toBeInstanceOf(Error0)
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe(usualError.message)
    expect(error.stack).toBe(usualError.stack)
    expect(error.name).toBe('Error0')
    expect(error.causes()).toEqual([error, causeError])
  })
})
