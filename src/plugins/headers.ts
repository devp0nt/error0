import { Error0 } from '../index.js'

export const headersPlugin = () =>
  Error0.plugin().prop('headers', {
    init: (headers: Record<string, string | undefined>) => headers,
    resolve: ({ flow }) => {
      let merged = undefined as Record<string, string | undefined> | undefined
      for (let i = flow.length - 1; i >= 0; i -= 1) {
        const headers = flow[i]
        if (!headers) {
          continue
        }
        merged = Object.assign(merged || {}, headers)
      }
      return merged
    },
    serialize: false,
    deserialize: false,
  })
