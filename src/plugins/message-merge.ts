import { Error0 } from '../index.js'

export const messageMergePlugin = ({
  delimiter = ': ',
  fallback = 'Unknown error',
}: { delimiter?: string; fallback?: string } = {}) =>
  Error0.plugin().use('message', {
    serialize: ({ error }) => {
      return (
        error
          .causes()
          .map((cause) => {
            return cause instanceof Error ? cause.message : undefined
          })
          .filter((value): value is string => typeof value === 'string')
          .join(delimiter) || fallback
      )
    },
  })
