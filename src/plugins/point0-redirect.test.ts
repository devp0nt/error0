import { describe, expect, it } from 'bun:test'
import { Error0 } from '../index.js'
import { redirectPlugin } from './point0-redirect.js'

describe('redirectPlugin', () => {
  it('initializes redirect and serializes it', () => {
    const AppError = Error0.use(redirectPlugin())
    const error = new AppError('test', {
      redirect: {
        to: '/login',
        status: 302,
        options: { replace: true, prefetch: 'clientQuery' },
      },
    })

    expect(error.redirect).toBeDefined()
    expect(error.redirect?.to).toBe('/login')
    expect(error.redirect?.status).toBe(302)
    expect(error.redirect?.options).toEqual({ replace: true, prefetch: 'clientQuery' })

    const json = AppError.serialize(error, false)
    expect(json.redirect).toEqual({
      to: '/login',
      status: 302,
      options: { replace: true, prefetch: 'clientQuery' },
    })
  })

  it('resolves redirect from cause when current error has no redirect', () => {
    const AppError = Error0.use(redirectPlugin())
    const cause = new AppError('cause', {
      redirect: {
        to: '/signup',
        options: { replace: false },
      },
    })
    const error = new AppError('root', { cause })

    expect(error.redirect).toBeDefined()
    expect(error.redirect?.to).toBe('/signup')
    expect(error.redirect?.options).toEqual({ replace: false })
  })

  it('deserializes redirect from serialized object', () => {
    const AppError = Error0.use(redirectPlugin())
    const recreated = AppError.from({
      message: 'serialized',
      redirect: {
        to: '/dashboard',
        status: 307,
        options: { prefetch: 'serverQuery' },
      },
    })

    expect(recreated.redirect).toBeDefined()
    expect(recreated.redirect?.to).toBe('/dashboard')
    expect(recreated.redirect?.status).toBe(307)
    expect(recreated.redirect?.options).toEqual({ prefetch: 'serverQuery' })
  })

  it('returns undefined for invalid serialized redirect payload', () => {
    const AppError = Error0.use(redirectPlugin())
    const recreated = AppError.from({
      message: 'bad redirect',
      redirect: { to: 123 },
    })

    expect(recreated.redirect).toBeUndefined()
  })
})
