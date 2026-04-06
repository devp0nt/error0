import { Error0 } from '../index.js'

export const responsePlugin = () =>
  Error0.plugin().prop('response', {
    init: (response: Response) => response,
    resolve: ({ flow }) => flow.find(Boolean),
    serialize: false,
    deserialize: false,
  })
