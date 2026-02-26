import { Error0 } from '../index.js'

export const tagsPlugin = ({ hideWhenPublic = true }: { hideWhenPublic?: boolean } = {}) =>
  Error0.plugin().prop('tags', {
    init: (input: string[]) => input,
    resolve: ({ flow }) => {
      const merged: string[] = []
      for (const value of flow) {
        if (Array.isArray(value)) {
          merged.push(...value.filter((item): item is string => typeof item === 'string'))
        }
      }
      return merged.length > 0 ? Array.from(new Set(merged)) : undefined
    },
    serialize: ({ resolved, isPublic }) => {
      if (hideWhenPublic && isPublic) {
        return undefined
      }
      return resolved
    },
    deserialize: ({ value }) => {
      if (!Array.isArray(value)) {
        return undefined
      }
      return value.filter((item): item is string => typeof item === 'string')
    },
  })
