import { Error0 } from '../index.js'

type Json = null | boolean | number | string | Json[] | { [key: string]: Json }

const toJsonSafe = (input: unknown): Json | undefined => {
  if (input === null) {
    return null
  }
  if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return input
  }
  if (Array.isArray(input)) {
    return input.map((value) => toJsonSafe(value)) as Json[]
  }
  if (typeof input === 'object') {
    const output: Record<string, Json> = {}
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      const jsonValue = toJsonSafe(value)
      if (jsonValue !== undefined) {
        output[key] = jsonValue
      }
    }
    return output
  }
  return undefined
}

const isMetaRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const metaPlugin = Error0.plugin().use('prop', 'meta', {
  init: (input: Record<string, unknown>) => input,
  resolve: ({ flow }) => {
    const values = flow.filter(isMetaRecord)
    if (values.length === 0) {
      return undefined
    }

    // Merge cause meta into the current error; nearer errors win on conflicts.
    const merged: Record<string, unknown> = {}
    for (const value of [...values].reverse()) {
      Object.assign(merged, value)
    }
    return merged
  },
  serialize: ({ value, isPublic }) => (isPublic ? undefined : toJsonSafe(value)),
  deserialize: ({ value }) => {
    if (!isMetaRecord(value)) {
      return undefined
    }
    return value
  },
})
