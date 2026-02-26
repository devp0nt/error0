import { Error0 } from '../index.js'

const isExpected = (flow: unknown[]) => {
  let expected = false
  for (const value of flow) {
    if (value === false) {
      return false
    }
    if (value === true) {
      expected = true
    }
  }
  return expected
}

export const expectedPlugin = ({ hideWhenPublic = true }: { hideWhenPublic?: boolean } = {}) =>
  Error0.plugin()
    .prop('expected', {
      init: (input: boolean) => input,
      resolve: ({ flow }) => isExpected(flow),
      serialize: ({ resolved, isPublic }) => {
        if (hideWhenPublic && isPublic) {
          return undefined
        }
        return resolved
      },
      deserialize: ({ value }) => (typeof value === 'boolean' ? value : undefined),
    })
    .method('isExpected', (error) => {
      return isExpected(error.flow('expected'))
    })
