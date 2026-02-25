import { Error0 } from '../index.js'

export const causeSerializePlugin = Error0.plugin().use('cause', {
  serialize: ({ value, error, isPublic }) => {
    const ctor = error.constructor as typeof Error0
    if (ctor.is(value)) {
      return ctor.serialize(value, isPublic)
    }
    return undefined
  },
})
