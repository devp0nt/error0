import { Error0 } from '../index.js'

export const stackMergePlugin = ({
  hideWhenPublic = true,
  delimiter = '\n',
}: { hideWhenPublic?: boolean; delimiter?: string } = {}) =>
  Error0.plugin().stack({
    serialize: ({ error, isPublic }) => {
      if (hideWhenPublic && isPublic) {
        return undefined
      }
      return error
        .causes()
        .map((cause) => {
          return cause instanceof Error ? cause.stack : undefined
        })
        .filter((value): value is string => typeof value === 'string')
        .join(delimiter)
    },
  })
