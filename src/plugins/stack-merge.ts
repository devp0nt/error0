import { Error0 } from '../index.js'

export const stackMergePlugin = ({
  isPublic = false,
  delimiter = '\n',
}: { isPublic?: boolean; delimiter?: string } = {}) =>
  Error0.plugin().stack({
    serialize: ({ error, isPublic: _isPublic }) => {
      if (!isPublic && _isPublic) {
        return undefined
      }
      return error
        .causes()
        .flatMap((cause) => {
          return cause instanceof Error && cause.stack && typeof cause.stack === 'string' ? cause.stack : []
        })
        .join(delimiter)
    },
  })
