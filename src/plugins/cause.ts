import { Error0 } from '../index.js'

type Variant = {
  new (...args: any[]): unknown
  [Symbol.hasInstance]: (value: any) => boolean
  isSerialized: (serializedCause: any) => boolean
  serialize: (error: any) => unknown
  from: (error: any) => unknown
}

export const causePlugin = <TVariants extends Record<string, Variant> = Record<never, Variant>>({
  isPublic = false,
  variants = undefined,
}: { isPublic?: boolean; variants?: TVariants } = {}) =>
  Error0.plugin().cause({
    serialize: ({ cause, isPublic: _isPublic, is, serialize }) => {
      if (!isPublic && _isPublic) {
        return undefined
      }
      if (variants) {
        for (const variant of Object.values(variants)) {
          if (cause instanceof variant) {
            return variant.serialize(cause)
          }
        }
      }
      if (is(cause)) {
        return serialize(cause)
      }
      return undefined
    },
    deserialize: ({ cause, fromSerialized, isSerialized }) => {
      if (variants) {
        for (const variant of Object.values(variants)) {
          if (variant.isSerialized(cause)) {
            return variant.from(cause)
          }
        }
      }
      if (isSerialized(cause)) {
        return fromSerialized(cause)
      }
      return cause
    },
  })
