import { Error0 } from '../index.js'

export const stackMergePlugin = Error0.plugin().use('stack', {
  serialize: ({ error, isPublic }) => {
    if (isPublic) {
      return undefined
    }
    return error
      .causes()
      .map((cause) => {
        return cause instanceof Error ? cause.stack : undefined
      })
      .filter((value): value is string => typeof value === 'string')
      .join('\n')
  },
})
