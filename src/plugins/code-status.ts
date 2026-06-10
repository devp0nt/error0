import { Error0 } from '../index.js'

export const codeStatusPlugin = <TCodes extends Record<string, number | true> = Record<string, number | true>>({
  codes,
  isPublic = false,
}: { codes?: TCodes; isPublic?: boolean } = {}) => {
  const isCode = (value: unknown): value is Extract<keyof TCodes, string> =>
    typeof value === 'string' && (!codes || value in codes)
  const statusByCode = (code: string | undefined): number | undefined => {
    const status = codes && code !== undefined ? codes[code] : undefined
    return typeof status === 'number' ? status : undefined
  }

  return Error0.plugin()
    .prop('code', {
      init: (code: Extract<keyof TCodes, string>) => code,
      resolve: ({ flow }) => flow.find(Boolean),
      serialize: ({ resolved, isPublic: _isPublic }) => {
        if (!isPublic && _isPublic) {
          return undefined
        }
        return resolved
      },
      deserialize: ({ value }) => (isCode(value) ? value : undefined),
    })
    .prop('status', {
      init: (status: number) => status,
      resolve: ({ flow }) => flow.find(Boolean),
      serialize: ({ resolved, isPublic: _isPublic }) => {
        if (!isPublic && _isPublic) {
          return undefined
        }
        return resolved
      },
      deserialize: ({ value }) => (typeof value === 'number' ? value : undefined),
    })
    .adapt((error) => {
      if (error.status !== undefined) {
        return undefined
      }
      const status = statusByCode(error.code)
      return status !== undefined ? { status } : undefined
    })
}
