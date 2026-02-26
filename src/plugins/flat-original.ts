import { Error0 } from '../index.js'

export const flatOriginalPlugin = ({ prefix }: { prefix?: string } = {}) => {
  return Error0.plugin().adapt((error) => {
    const cause = error.cause
    if (cause instanceof Error && cause.constructor === Error) {
      error.cause = cause.cause
      error.message = `${prefix ?? ''}${cause.message}`
      error.stack = cause.stack
    }
  })
}
