import { Error0 } from '../index.js'

export const tagsPlugin = Error0.plugin().use('prop', 'tags', {
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
  serialize: ({ resolved, isPublic }) => (isPublic ? undefined : resolved),
  deserialize: ({ value }) => {
    if (!Array.isArray(value)) {
      return undefined
    }
    return value.filter((item): item is string => typeof item === 'string')
  },
})
