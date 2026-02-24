export type ErrorExtensionPropOptions<TInputValue, TOutputValue> = {
  setter: (value: TInputValue) => TOutputValue
  getter: (error: Error0) => TOutputValue
  serialize: (value: TOutputValue, isPublic: boolean) => unknown
}
export type ErrorExtensionCopmputedFn<TOutputValue> = (error: Error0) => TOutputValue
export type ErrorExtensionMethodFn<TOutputValue, TArgs extends unknown[] = unknown[]> = (
  error: Error0,
  ...args: TArgs
) => TOutputValue
type ErrorMethodRecord = {
  args: unknown[]
  output: unknown
}

// Изменяем Record на более гибкий тип, чтобы не "глушить" вывод через any
export type ErrorExtensionProps = { [key: string]: ErrorExtensionPropOptions<any, any> }
export type ErrorExtensionComputed = { [key: string]: ErrorExtensionCopmputedFn<any> }
export type ErrorExtensionMethods = { [key: string]: ErrorExtensionMethodFn<any, any[]> }

export type ErrorExtension<
  TProps extends ErrorExtensionProps = Record<never, never>,
  TComputed extends ErrorExtensionComputed = Record<never, never>,
  TMethods extends ErrorExtensionMethods = Record<never, never>,
> = {
  props?: TProps
  computed?: TComputed
  methods?: TMethods
}
export type ErrorExtensionsMap = {
  props: Record<string, { input: unknown; output: unknown }>
  computed: Record<string, unknown>
  methods: Record<string, ErrorMethodRecord>
}
export type IsEmptyObject<T> = keyof T extends never ? true : false
export type ErrorInputBase = {
  cause?: unknown
}
export type ErrorInput<TExtensionsMap extends ErrorExtensionsMap> =
  IsEmptyObject<TExtensionsMap['props']> extends true
    ? ErrorInputBase
    : ErrorInputBase &
        Partial<{
          [TKey in keyof TExtensionsMap['props']]: TExtensionsMap['props'][TKey]['input']
        }>

type ErrorOutputProps<TExtensionsMap extends ErrorExtensionsMap> = {
  [TKey in keyof TExtensionsMap['props']]: TExtensionsMap['props'][TKey]['output']
}
type ErrorOutputComputed<TExtensionsMap extends ErrorExtensionsMap> = {
  [TKey in keyof TExtensionsMap['computed']]: TExtensionsMap['computed'][TKey]
}
type ErrorOutputMethods<TExtensionsMap extends ErrorExtensionsMap> = {
  [TKey in keyof TExtensionsMap['methods']]: TExtensionsMap['methods'][TKey] extends {
    args: infer TArgs extends unknown[]
    output: infer TOutput
  }
    ? (...args: TArgs) => TOutput
    : never
}
export type ErrorOutput<TExtensionsMap extends ErrorExtensionsMap> = ErrorOutputProps<TExtensionsMap> &
  ErrorOutputComputed<TExtensionsMap> &
  ErrorOutputMethods<TExtensionsMap>

type ErrorStaticMethods<TExtensionsMap extends ErrorExtensionsMap> = {
  [TKey in keyof TExtensionsMap['methods']]: TExtensionsMap['methods'][TKey] extends {
    args: infer TArgs extends unknown[]
    output: infer TOutput
  }
    ? (error: Error0, ...args: TArgs) => TOutput
    : never
}

type EmptyExtensionsMap = {
  props: Record<never, { input: never; output: never }>
  computed: Record<never, never>
  methods: Record<never, ErrorMethodRecord>
}

type ErrorExtensionResolved = {
  props: Record<string, ErrorExtensionPropOptions<unknown, unknown>>
  computed: Record<string, ErrorExtensionCopmputedFn<unknown>>
  methods: Record<string, ErrorExtensionMethodFn<unknown>>
}

type ExtensionPropsMapOf<TExtension extends ErrorExtension> = {
  [TKey in keyof NonNullable<TExtension['props']>]: NonNullable<
    TExtension['props']
  >[TKey] extends ErrorExtensionPropOptions<infer TInputValue, infer TOutputValue>
    ? { input: TInputValue; output: TOutputValue }
    : never
}
type ExtensionComputedMapOf<TExtension extends ErrorExtension> = {
  [TKey in keyof NonNullable<TExtension['computed']>]: NonNullable<
    TExtension['computed']
  >[TKey] extends ErrorExtensionCopmputedFn<infer TOutputValue>
    ? TOutputValue
    : never
}
type ExtensionMethodsMapOf<TExtension extends ErrorExtension> = {
  [TKey in keyof NonNullable<TExtension['methods']>]: NonNullable<TExtension['methods']>[TKey] extends (
    error: Error0,
    ...args: infer TArgs extends unknown[]
  ) => infer TOutput
    ? { args: TArgs; output: TOutput }
    : never
}
type ErrorExtensionsMapOfExtension<TExtension extends ErrorExtension> = {
  props: ExtensionPropsMapOf<TExtension>
  computed: ExtensionComputedMapOf<TExtension>
  methods: ExtensionMethodsMapOf<TExtension>
}
type ExtendErrorExtensionsMap<TMap extends ErrorExtensionsMap, TExtension extends ErrorExtension> = {
  props: TMap['props'] & ErrorExtensionsMapOfExtension<TExtension>['props']
  computed: TMap['computed'] & ErrorExtensionsMapOfExtension<TExtension>['computed']
  methods: TMap['methods'] & ErrorExtensionsMapOfExtension<TExtension>['methods']
}

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
  serialize: (error: unknown, isPublic?: boolean) => object
  extend: <
    TProps extends ErrorExtensionProps,
    TComputed extends ErrorExtensionComputed,
    TMethods extends ErrorExtensionMethods,
  >(
    extension: ErrorExtension<TProps, TComputed, TMethods>,
  ) => ClassError0<ExtendErrorExtensionsMap<TExtensionsMap, ErrorExtension<TProps, TComputed, TMethods>>>
  extension: <
    TProps extends ErrorExtensionProps,
    TComputed extends ErrorExtensionComputed,
    TMethods extends ErrorExtensionMethods,
  >(
    extension: ErrorExtension<TProps, TComputed, TMethods>,
  ) => ErrorExtension<TProps, TComputed, TMethods>
} & ErrorStaticMethods<TExtensionsMap>

export class Error0 extends Error {
  static readonly __extensionsMap?: EmptyExtensionsMap
  protected static _extensions: ErrorExtension[] = []

  private static readonly _emptyExtension: ErrorExtensionResolved = {
    props: {},
    computed: {},
    methods: {},
  }

  private static _getResolvedExtension(this: typeof Error0): ErrorExtensionResolved {
    const resolved: ErrorExtensionResolved = {
      props: {},
      computed: {},
      methods: {},
    }
    for (const extension of this._extensions) {
      Object.assign(resolved.props, extension.props ?? this._emptyExtension.props)
      Object.assign(resolved.computed, extension.computed ?? this._emptyExtension.computed)
      Object.assign(resolved.methods, extension.methods ?? this._emptyExtension.methods)
    }
    return resolved
  }

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
    const extension = ctor._getResolvedExtension()

    for (const [key, prop] of Object.entries(extension.props)) {
      if (key in input) {
        const ownValue = (input as Record<string, unknown>)[key]
        ;(this as Record<string, unknown>)[key] = prop.setter(ownValue)
      } else {
        Object.defineProperty(this, key, {
          get: () => prop.getter(this),
          set: (value) => {
            Object.defineProperty(this, key, {
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

    for (const [key, computed] of Object.entries(extension.computed)) {
      Object.defineProperty(this, key, {
        get: () => computed(this),
        set: (value) => {
          Object.defineProperty(this, key, {
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

  static get(error: object, key: string): unknown {
    return (error as Record<string, unknown>)[key]
  }
  get(key: string): unknown {
    const ctor = this.constructor as typeof Error0
    return ctor.get(this, key)
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

  static isInstance(error: unknown): error is Error0 {
    return error instanceof this
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
    if (this.isInstance(error)) {
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
      return new this(message, { cause: error })
    }

    const errorRecord = error as Record<string, unknown>
    const recreated = new this(message)
    const temp = new this(message, { cause: errorRecord })
    const extension = this._getResolvedExtension()
    for (const [key, prop] of Object.entries(extension.props)) {
      const value = key in errorRecord ? prop.setter(errorRecord[key]) : prop.getter(temp)
      if (value !== undefined) {
        ;(recreated as unknown as Record<string, unknown>)[key] = value
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
    return new this(message, { cause: error })
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

  static extend<
    TThis extends typeof Error0,
    TProps extends ErrorExtensionProps,
    TComputed extends ErrorExtensionComputed,
    TMethods extends ErrorExtensionMethods,
  >(
    this: TThis,
    extension: {
      props?: TProps
      computed?: TComputed
      methods?: TMethods
    },
  ): ClassError0<ExtendErrorExtensionsMap<ExtensionsMapOf<TThis>, ErrorExtension<TProps, TComputed, TMethods>>>
  static extend(
    this: typeof Error0,
    extension: ErrorExtension<ErrorExtensionProps, ErrorExtensionComputed, ErrorExtensionMethods>,
  ): any {
    const Base = this as unknown as typeof Error0
    const Error0Extended = class Error0 extends Base {}
    ;(Error0Extended as typeof Error0)._extensions = [...Base._extensions, extension]

    const resolved = (Error0Extended as typeof Error0)._getResolvedExtension()
    for (const [key, method] of Object.entries(resolved.methods)) {
      Object.defineProperty((Error0Extended as typeof Error0).prototype, key, {
        value: function (...args: unknown[]) {
          return method(this as Error0, ...args)
        },
        writable: true,
        enumerable: true,
        configurable: true,
      })
      Object.defineProperty(Error0Extended, key, {
        value: method,
        writable: true,
        enumerable: true,
        configurable: true,
      })
    }

    return Error0Extended
  }

  static extension<
    TProps extends ErrorExtensionProps,
    TComputed extends ErrorExtensionComputed,
    TMethods extends ErrorExtensionMethods,
  >(extension: {
    props?: TProps
    computed?: TComputed
    methods?: TMethods
  }): ErrorExtension<TProps, TComputed, TMethods> {
    return extension as ErrorExtension<TProps, TComputed, TMethods>
  }

  static serialize(error: unknown, isPublic = false): object {
    const error0 = this.from(error)
    const jsonWithUndefined: Record<string, unknown> = {
      name: error0.name,
      message: error0.message,
      cause: error0.cause,
      stack: error0.stack,
    }

    const extension = this._getResolvedExtension()
    for (const [key, prop] of Object.entries(extension.props)) {
      const value = prop.getter(error0)
      const jsonValue = prop.serialize(value, isPublic)
      if (jsonValue !== undefined) {
        jsonWithUndefined[key] = jsonValue
      }
    }
    for (const [key, computed] of Object.entries(extension.computed)) {
      const value = computed(error0)
      if (value !== undefined) {
        jsonWithUndefined[key] = value
      }
    }
    return Object.fromEntries(Object.entries(jsonWithUndefined).filter(([, value]) => value !== undefined)) as object
  }

  serialize(isPublic = false): object {
    const ctor = this.constructor as typeof Error0
    return ctor.serialize(this, isPublic)
  }
}
