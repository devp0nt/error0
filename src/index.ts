export type ErrorExtension<TKey extends string, TInputValue, TOutputValue> = {
  key: TKey
  setter: (value: TInputValue) => TOutputValue
  getter: (error: Error0) => TOutputValue
  toJson?: (value: TOutputValue) => unknown
}
export type ErrorExtensionsMap = Record<string, { input: unknown; output: unknown }>
export type ExtendErrorExtensionsMap<
  TMap extends ErrorExtensionsMap,
  TExtension extends ErrorExtension<string, unknown, unknown>,
> = TMap &
  (TExtension extends ErrorExtension<infer TKey, infer TInputValue, infer TOutputValue>
    ? Record<TKey, { input: TInputValue; output: TOutputValue }>
    : unknown)
export type IsEmptyObject<T> = keyof T extends never ? true : false
export type ErrorInputBase = {
  cause?: unknown
}
export type ErrorInput<TExtensionsMap extends ErrorExtensionsMap> =
  IsEmptyObject<TExtensionsMap> extends true
    ? ErrorInputBase
    : ErrorInputBase &
        Partial<{
          [TKey in keyof TExtensionsMap]: TExtensionsMap[TKey]['input']
        }>
export type ErrorOutput<TExtensionsMap extends ErrorExtensionsMap> = {
  [TKey in keyof TExtensionsMap]: TExtensionsMap[TKey]['output']
}

type EmptyExtensionsMap = Record<never, { input: never; output: never }>
type ExtensionsMapOf<TClass> = TClass extends { __extensionsMap?: infer TExtensionsMap }
  ? TExtensionsMap extends ErrorExtensionsMap
    ? TExtensionsMap
    : EmptyExtensionsMap
  : EmptyExtensionsMap

export type ClassError0<TExtensionsMap extends ErrorExtensionsMap = EmptyExtensionsMap> = {
  new (message: string, input?: ErrorInput<TExtensionsMap>): Error0 & ErrorOutput<TExtensionsMap>
  new (input: { message: string } & ErrorInput<TExtensionsMap>): Error0 & ErrorOutput<TExtensionsMap>
  readonly __extensionsMap?: TExtensionsMap
  from: (error: unknown) => Error0 & ErrorOutput<TExtensionsMap>
  toJson: (error: unknown) => object
  extend: <TKey extends string, TInputValue, TOutputValue>(
    extension: ErrorExtension<TKey, TInputValue, TOutputValue>,
  ) => ClassError0<TExtensionsMap & Record<TKey, { input: TInputValue; output: TOutputValue }>>
  extension: <T extends ErrorExtension<string, unknown, unknown>>(extension: T) => T
}

export class Error0 extends Error {
  static readonly __extensionsMap?: EmptyExtensionsMap
  protected static _extensions: Array<ErrorExtension<string, unknown, unknown>> = []

  constructor(message: string, input?: ErrorInput<EmptyExtensionsMap>)
  constructor(input: { message: string } & ErrorInput<EmptyExtensionsMap>)
  constructor(
    ...args:
      | [message: string, input?: ErrorInput<EmptyExtensionsMap>]
      | [{ message: string } & ErrorInput<EmptyExtensionsMap>]
  ) {
    const [first, second] = args
    const input = typeof first === 'string' ? { message: first, ...(second ?? {}) } : first

    super(input.message, { cause: input.cause })
    this.name = 'Error0'

    const ctor = this.constructor as typeof Error0
    for (const extension of ctor._extensions) {
      if (extension.key in input) {
        const ownValue = (input as Record<string, unknown>)[extension.key]
        ;(this as Record<string, unknown>)[extension.key] = extension.setter(ownValue)
      } else {
        Object.defineProperty(this, extension.key, {
          get: () => extension.getter(this),
          set: (value) => {
            Object.defineProperty(this, extension.key, {
              value,
              writable: true,
              enumerable: true,
              configurable: true,
            })
          },
          enumerable: true,
          configurable: true,
        })
      }
    }
  }

  private static readonly isSelfProperty = (object: object, key: string): boolean => {
    const d = Object.getOwnPropertyDescriptor(object, key)
    if (!d) return false
    if (typeof d.get === 'function' || typeof d.set === 'function') {
      if ('name' in object && object.name === 'Error0') {
        return false
      } else {
        return true
      }
    }
    return true
  }

  static own(error: object, key: string): unknown {
    if (this.isSelfProperty(error, key)) {
      return (error as Record<string, unknown>)[key]
    }
    return undefined
  }
  own(key: string): unknown {
    const ctor = this.constructor as typeof Error0
    return ctor.own(this, key)
  }

  static flow(error: object, key: string, filter?: true | ((value: unknown) => boolean)): unknown[] {
    const values = this.causes(error).map((cause) => {
      const causeRecord = cause as Record<string, unknown>
      if (this.isSelfProperty(causeRecord, key)) {
        return causeRecord[key]
      }
      return undefined
    })

    if (filter === undefined) {
      return values
    }
    if (filter === true) {
      return values.filter((value) => value !== undefined)
    }
    return values.filter((value) => filter(value))
  }
  flow(key: string, filter?: true | ((value: unknown) => boolean)): unknown[] {
    const ctor = this.constructor as typeof Error0
    return ctor.flow(this, key, filter)
  }

  static causes(error: object, filter?: (cause: object) => boolean): object[] {
    const causes: object[] = []
    let current: unknown = error
    const maxDepth = 99
    const seen = new Set<unknown>()

    for (let depth = 0; depth < maxDepth; depth += 1) {
      if (!current || typeof current !== 'object') {
        break
      }
      if (seen.has(current)) {
        break
      }
      seen.add(current)
      if (!filter || filter(current)) {
        causes.push(current)
      }
      current = (current as { cause?: unknown }).cause
    }

    return causes
  }
  causes(filter?: (cause: object) => boolean): object[] {
    const ctor = this.constructor as typeof Error0
    return ctor.causes(this, filter)
  }

  static isError0(error: unknown): error is Error0 {
    return error instanceof Error0
  }

  static isLikeError0(error: unknown): error is Error0 | object {
    return (
      error instanceof Error0 ||
      (typeof error === 'object' && error !== null && 'name' in error && error.name === 'Error0')
    )
  }

  static from(error: unknown): Error0 {
    if (this.isError0(error)) {
      return error
    }
    if (this.isLikeError0(error)) {
      return this._fromLikeError0(error)
    }
    return this._fromNonError0(error)
  }

  private static _fromLikeError0(error: unknown): Error0 {
    const message = this._extractMessage(error)
    if (typeof error !== 'object' || error === null) {
      return new Error0(message, { cause: error })
    }

    const errorRecord = error as Record<string, unknown>
    const recreated = new this(message)
    const temp = new this(message, { cause: errorRecord })
    for (const extension of this._extensions) {
      const value = extension.getter(temp)
      if (value !== undefined) {
        ;(recreated as unknown as Record<string, unknown>)[extension.key] = value
      }
    }
    ;(recreated as unknown as { cause?: unknown }).cause = errorRecord.cause
    if (typeof errorRecord.stack === 'string') {
      recreated.stack = errorRecord.stack
    }
    return recreated
  }

  private static _fromNonError0(error: unknown): Error0 {
    const message = this._extractMessage(error)
    return new Error0(message, { cause: error })
  }

  private static _extractMessage(error: unknown): string {
    return (
      (typeof error === 'string'
        ? error
        : typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
          ? error.message
          : undefined) || 'Unknown error'
    )
  }

  static extend<TThis extends typeof Error0, TKey extends string, TInputValue, TOutputValue>(
    this: TThis,
    extension: ErrorExtension<TKey, TInputValue, TOutputValue>,
  ): ClassError0<ExtensionsMapOf<TThis> & Record<TKey, { input: TInputValue; output: TOutputValue }>>
  static extend(this: typeof Error0, extension: ErrorExtension<string, unknown, unknown>): any {
    const Base = this as unknown as typeof Error0
    const Error0Extended = class Error0 extends Base {}
    ;(Error0Extended as typeof Error0)._extensions = [...Base._extensions, extension]
    return Error0Extended
  }

  static extension<TKey extends string, TInputValue, TOutputValue>(
    extension: ErrorExtension<TKey, TInputValue, TOutputValue>,
  ): ErrorExtension<TKey, TInputValue, TOutputValue> {
    return extension
  }

  static toJson(error: unknown): object {
    const error0 = this.from(error)
    const jsonWithUndefined: Record<string, unknown> = {
      name: error0.name,
      message: error0.message,
      cause: error0.cause,
      stack: error0.stack,
    }
    for (const extension of this._extensions) {
      const value = extension.getter(error0)
      const jsonValue = extension.toJson ? extension.toJson(value) : value
      if (jsonValue !== undefined) {
        jsonWithUndefined[extension.key] = jsonValue
      }
    }
    return Object.fromEntries(Object.entries(jsonWithUndefined).filter(([, value]) => value !== undefined)) as object
  }
  toJson(): object {
    const ctor = this.constructor as typeof Error0
    return ctor.toJson(this)
  }
}

// example
// const extension = Error0.extension({
//   key: 'status',
//   getter: (values) => {
//     const number = Number(values[0].status)
//     if (isNaN(number)) {
//       return undefined
//     }
//     return number
//   },
// }

// const AppError = (Error0.use(extension)
// .use('code', (values) => {
//   return values[1].code
// })
// .use('expected', (values) => {
//   return values[1] || false
// })

// const error = new AppError('test', {
//   code: 'my_code',
//   expected: true,
//   // here all meta fields is optional we can even not prvide second argument
// })

// error.expected // alway defined, becouse of TValue
// error.status // number | undefiend, becouse of TValue
