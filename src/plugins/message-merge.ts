import { Error0 } from '../index.js'

export const messageMergePlugin = Error0.plugin().use('message', {
  serialize: ({ error }) => {
    return (
      error
        .causes()
        .map((cause) => {
          return cause instanceof Error ? cause.message : undefined
        })
        .filter((value): value is string => typeof value === 'string')
        .join(': ') || 'Unknown error'
    )
  },
})
