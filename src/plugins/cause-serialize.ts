import { Error0 } from '../index.js'

export const causeSerializePlugin = ({ hideWhenPublic = true }: { hideWhenPublic?: boolean } = {}) =>
  Error0.plugin().use('cause', {
    serialize: ({ value, error, isPublic }) => {
      if (hideWhenPublic && isPublic) {
        return undefined
      }
      const ctor = error.constructor as typeof Error0
      if (ctor.is(value)) {
        return ctor.serialize(value, isPublic)
      }
      return undefined
    },
  })
