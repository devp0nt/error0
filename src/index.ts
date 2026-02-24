export type ErrorExtensionPropOptions<TInputValue, TOutputValue, TError extends Error0 = Error0> = {
  input: (value: TInputValue) => TOutputValue
  output: (error: TError) => TOutputValue
  serialize: (value: TOutputValue, error: TError, isPublic: boolean) => unknown
}
export type ErrorExtensionCopmputedFn<TOutputValue, TError extends Error0 = Error0> = (error: TError) => TOutputValue
export type ErrorExtensionMethodFn<
  TOutputValue,
  TArgs extends unknown[] = unknown[],
  TError extends Error0 = Error0,
> = (error: TError, ...args: TArgs) => TOutputValue
export type ErrorExtensionRefineResult<TOutputProps extends Record<string, unknown>> = Partial<TOutputProps> | undefined
export type ErrorExtensionRefineFn<
  TError extends Error0 = Error0,
  TOutputProps extends Record<string, unknown> = Record<never, never>,
> = ((error: TError) => void) | ((error: TError) => ErrorExtensionRefineResult<TOutputProps>)
type ErrorMethodRecord = {
  args: unknown[]
  output: unknown
}

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
  refine?: Array<ErrorExtensionRefineFn<Error0, ExtensionOutputProps<TProps>>>
}
type AddPropToExtensionProps<
  TProps extends ErrorExtensionProps,
  TKey extends string,
  TInputValue,
  TOutputValue,
> = TProps & Record<TKey, ErrorExtensionPropOptions<TInputValue, TOutputValue>>
type AddComputedToExtensionComputed<
  TComputed extends ErrorExtensionComputed,
  TKey extends string,
  TOutputValue,
> = TComputed & Record<TKey, ErrorExtensionCopmputedFn<TOutputValue>>
type AddMethodToExtensionMethods<
  TMethods extends ErrorExtensionMethods,
  TKey extends string,
  TArgs extends unknown[],
  TOutputValue,
> = TMethods & Record<TKey, ErrorExtensionMethodFn<TOutputValue, TArgs>>
type ExtensionOutputProps<TProps extends ErrorExtensionProps> = {
  [TKey in keyof TProps]: TProps[TKey] extends ErrorExtensionPropOptions<any, infer TOutputValue> ? TOutputValue : never
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
    ? (error: unknown, ...args: TArgs) => TOutput
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
  refine: Array<ErrorExtensionRefineFn<Error0, Record<string, unknown>>>
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
type ExtendErrorExtensionsMapWithProp<
  TMap extends ErrorExtensionsMap,
  TKey extends string,
  TInputValue,
  TOutputValue,
> = ExtendErrorExtensionsMap<TMap, ErrorExtension<Record<TKey, ErrorExtensionPropOptions<TInputValue, TOutputValue>>>>
type ExtendErrorExtensionsMapWithComputed<
  TMap extends ErrorExtensionsMap,
  TKey extends string,
  TOutputValue,
> = ExtendErrorExtensionsMap<
  TMap,
  ErrorExtension<Record<never, never>, Record<TKey, ErrorExtensionCopmputedFn<TOutputValue>>>
>
type ExtendErrorExtensionsMapWithMethod<
  TMap extends ErrorExtensionsMap,
  TKey extends string,
  TArgs extends unknown[],
  TOutputValue,
> = ExtendErrorExtensionsMap<
  TMap,
  ErrorExtension<Record<never, never>, Record<never, never>, Record<TKey, ErrorExtensionMethodFn<TOutputValue, TArgs>>>
>

type ExtensionsMapOf<TClass> = TClass extends { __extensionsMap?: infer TExtensionsMap }
  ? TExtensionsMap extends ErrorExtensionsMap
    ? TExtensionsMap
    : EmptyExtensionsMap
  : EmptyExtensionsMap

type ExtensionsMapFromParts<
  TProps extends ErrorExtensionProps,
  TComputed extends ErrorExtensionComputed,
  TMethods extends ErrorExtensionMethods,
> = ErrorExtensionsMapOfExtension<ErrorExtension<TProps, TComputed, TMethods>>
type ErrorInstanceOfMap<TMap extends ErrorExtensionsMap> = Error0 & ErrorOutput<TMap>
type BuilderError0<
  TProps extends ErrorExtensionProps,
  TComputed extends ErrorExtensionComputed,
  TMethods extends ErrorExtensionMethods,
> = Error0 & ErrorOutput<ExtensionsMapFromParts<TProps, TComputed, TMethods>>

type ExtensionOfBuilder<TBuilder> =
  TBuilder extends ExtensionError0<infer TProps, infer TComputed, infer TMethods>
    ? ErrorExtension<TProps, TComputed, TMethods>
    : never

export type ErrorFlowPolicy = 'instance' | 'error0' | 'likeError0' | 'all'

export class ExtensionError0<
  TProps extends ErrorExtensionProps = Record<never, never>,
  TComputed extends ErrorExtensionComputed = Record<never, never>,
  TMethods extends ErrorExtensionMethods = Record<never, never>,
> {
  private readonly _extension: ErrorExtension<ErrorExtensionProps, ErrorExtensionComputed, ErrorExtensionMethods>

  readonly Infer = undefined as unknown as {
    props: TProps
    computed: TComputed
    methods: TMethods
  }

  constructor(extension?: ErrorExtension<ErrorExtensionProps, ErrorExtensionComputed, ErrorExtensionMethods>) {
    this._extension = {
      props: { ...(extension?.props ?? {}) },
      computed: { ...(extension?.computed ?? {}) },
      methods: { ...(extension?.methods ?? {}) },
      refine: [...(extension?.refine ?? [])],
    }
  }

  prop<TKey extends string, TInputValue, TOutputValue>(
    key: TKey,
    value: ErrorExtensionPropOptions<TInputValue, TOutputValue, BuilderError0<TProps, TComputed, TMethods>>,
  ): ExtensionError0<AddPropToExtensionProps<TProps, TKey, TInputValue, TOutputValue>, TComputed, TMethods> {
    return this.extend('prop', key, value)
  }

  computed<TKey extends string, TOutputValue>(
    key: TKey,
    value: ErrorExtensionCopmputedFn<TOutputValue, BuilderError0<TProps, TComputed, TMethods>>,
  ): ExtensionError0<TProps, AddComputedToExtensionComputed<TComputed, TKey, TOutputValue>, TMethods> {
    return this.extend('computed', key, value)
  }

  method<TKey extends string, TArgs extends unknown[], TOutputValue>(
    key: TKey,
    value: ErrorExtensionMethodFn<TOutputValue, TArgs, BuilderError0<TProps, TComputed, TMethods>>,
  ): ExtensionError0<TProps, TComputed, AddMethodToExtensionMethods<TMethods, TKey, TArgs, TOutputValue>> {
    return this.extend('method', key, value)
  }

  refine(
    value: ErrorExtensionRefineFn<BuilderError0<TProps, TComputed, TMethods>, ExtensionOutputProps<TProps>>,
  ): ExtensionError0<TProps, TComputed, TMethods> {
    return this.extend('refine', value)
  }

  extend<TKey extends string, TInputValue, TOutputValue>(
    kind: 'prop',
    key: TKey,
    value: ErrorExtensionPropOptions<TInputValue, TOutputValue, BuilderError0<TProps, TComputed, TMethods>>,
  ): ExtensionError0<AddPropToExtensionProps<TProps, TKey, TInputValue, TOutputValue>, TComputed, TMethods>
  extend<TKey extends string, TOutputValue>(
    kind: 'computed',
    key: TKey,
    value: ErrorExtensionCopmputedFn<TOutputValue, BuilderError0<TProps, TComputed, TMethods>>,
  ): ExtensionError0<TProps, AddComputedToExtensionComputed<TComputed, TKey, TOutputValue>, TMethods>
  extend<TKey extends string, TArgs extends unknown[], TOutputValue>(
    kind: 'method',
    key: TKey,
    value: ErrorExtensionMethodFn<TOutputValue, TArgs, BuilderError0<TProps, TComputed, TMethods>>,
  ): ExtensionError0<TProps, TComputed, AddMethodToExtensionMethods<TMethods, TKey, TArgs, TOutputValue>>
  extend(
    kind: 'refine',
    value: ErrorExtensionRefineFn<BuilderError0<TProps, TComputed, TMethods>, ExtensionOutputProps<TProps>>,
  ): ExtensionError0<TProps, TComputed, TMethods>
  extend(
    kind: 'prop' | 'computed' | 'method' | 'refine',
    keyOrValue: string | ErrorExtensionRefineFn<any, any>,
    value?:
      | ErrorExtensionPropOptions<unknown, unknown, any>
      | ErrorExtensionCopmputedFn<unknown, any>
      | ErrorExtensionMethodFn<unknown, unknown[], any>,
  ): ExtensionError0<any, any, any> {
    const nextProps: ErrorExtensionProps = { ...(this._extension.props ?? {}) }
    const nextComputed: ErrorExtensionComputed = { ...(this._extension.computed ?? {}) }
    const nextMethods: ErrorExtensionMethods = { ...(this._extension.methods ?? {}) }
    const nextRefine: Array<ErrorExtensionRefineFn<Error0, Record<string, unknown>>> = [
      ...(this._extension.refine ?? []),
    ]
    if (kind === 'prop') {
      const key = keyOrValue as string
      if (value === undefined) {
        throw new Error('ExtensionError0.extend("prop", key, value) requires value')
      }
      nextProps[key] = value as ErrorExtensionPropOptions<any, any>
    } else if (kind === 'computed') {
      const key = keyOrValue as string
      if (value === undefined) {
        throw new Error('ExtensionError0.extend("computed", key, value) requires value')
      }
      nextComputed[key] = value as ErrorExtensionCopmputedFn<any>
    } else if (kind === 'method') {
      const key = keyOrValue as string
      if (value === undefined) {
        throw new Error('ExtensionError0.extend("method", key, value) requires value')
      }
      nextMethods[key] = value as ErrorExtensionMethodFn<any, any[]>
    } else {
      nextRefine.push(keyOrValue as ErrorExtensionRefineFn<Error0, Record<string, unknown>>)
    }
    return new ExtensionError0({
      props: nextProps,
      computed: nextComputed,
      methods: nextMethods,
      refine: nextRefine,
    })
  }
}

export type ClassError0<TExtensionsMap extends ErrorExtensionsMap = EmptyExtensionsMap> = {
  new (message: string, input?: ErrorInput<TExtensionsMap>): Error0 & ErrorOutput<TExtensionsMap>
  new (input: { message: string } & ErrorInput<TExtensionsMap>): Error0 & ErrorOutput<TExtensionsMap>
  readonly __extensionsMap?: TExtensionsMap
  from: (error: unknown) => Error0 & ErrorOutput<TExtensionsMap>
  serialize: (error: unknown, isPublic?: boolean) => object
  extend: {
    <TBuilder extends ExtensionError0>(
      extension: TBuilder,
    ): ClassError0<ExtendErrorExtensionsMap<TExtensionsMap, ExtensionOfBuilder<TBuilder>>>
    <TKey extends string, TInputValue, TOutputValue>(
      kind: 'prop',
      key: TKey,
      value: ErrorExtensionPropOptions<TInputValue, TOutputValue, ErrorInstanceOfMap<TExtensionsMap>>,
    ): ClassError0<ExtendErrorExtensionsMapWithProp<TExtensionsMap, TKey, TInputValue, TOutputValue>>
    <TKey extends string, TOutputValue>(
      kind: 'computed',
      key: TKey,
      value: ErrorExtensionCopmputedFn<TOutputValue, ErrorInstanceOfMap<TExtensionsMap>>,
    ): ClassError0<ExtendErrorExtensionsMapWithComputed<TExtensionsMap, TKey, TOutputValue>>
    <TKey extends string, TArgs extends unknown[], TOutputValue>(
      kind: 'method',
      key: TKey,
      value: ErrorExtensionMethodFn<TOutputValue, TArgs, ErrorInstanceOfMap<TExtensionsMap>>,
    ): ClassError0<ExtendErrorExtensionsMapWithMethod<TExtensionsMap, TKey, TArgs, TOutputValue>>
    (
      kind: 'refine',
      value: ErrorExtensionRefineFn<ErrorInstanceOfMap<TExtensionsMap>, ErrorOutputProps<TExtensionsMap>>,
    ): ClassError0<TExtensionsMap>
  }
  extension: () => ExtensionError0
} & ErrorStaticMethods<TExtensionsMap>

export class Error0 extends Error {
  static readonly __extensionsMap?: EmptyExtensionsMap
  protected static _extensions: ErrorExtension[] = []

  private static readonly _emptyExtension: ErrorExtensionResolved = {
    props: {},
    computed: {},
    methods: {},
    refine: [],
  }

  private static _getResolvedExtension(this: typeof Error0): ErrorExtensionResolved {
    const resolved: ErrorExtensionResolved = {
      props: {},
      computed: {},
      methods: {},
      refine: [],
    }
    for (const extension of this._extensions) {
      Object.assign(resolved.props, extension.props ?? this._emptyExtension.props)
      Object.assign(resolved.computed, extension.computed ?? this._emptyExtension.computed)
      Object.assign(resolved.methods, extension.methods ?? this._emptyExtension.methods)
      resolved.refine.push(...(extension.refine ?? this._emptyExtension.refine))
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
        ;(this as Record<string, unknown>)[key] = prop.input(ownValue)
      } else {
        Object.defineProperty(this, key, {
          get: () => prop.output(this),
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

  static flow(error: object, key: string, policy: ErrorFlowPolicy = 'likeError0'): unknown[] {
    return this.causes(error, policy).map((cause) => {
      const causeRecord = cause as Record<string, unknown>
      if (this.isSelfProperty(causeRecord, key)) {
        return causeRecord[key]
      }
      return undefined
    })
  }
  flow(key: string, policy: ErrorFlowPolicy = 'likeError0'): unknown[] {
    const ctor = this.constructor as typeof Error0
    return ctor.flow(this, key, policy)
  }

  static causes(error: object, policy: ErrorFlowPolicy = 'all'): object[] {
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
      if (policy === 'instance') {
        if (!this.is(current)) {
          break
        }
      } else if (policy === 'error0') {
        if (!this.isError0(current)) {
          break
        }
      } else if (policy === 'likeError0') {
        if (!this.isLikeError0(current)) {
          break
        }
      }
      seen.add(current)
      causes.push(current)
      current = (current as { cause?: unknown }).cause
    }

    return causes
  }
  causes(policy: ErrorFlowPolicy = 'all'): object[] {
    const ctor = this.constructor as typeof Error0
    return ctor.causes(this, policy)
  }

  static is(error: unknown): error is Error0 {
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
    if (this.is(error)) {
      return error
    }
    if (this.isLikeError0(error)) {
      return this._fromLikeError0(error)
    }
    return this._fromNonError0(error)
  }

  private static _applyRefine(error: Error0): Error0 {
    const extension = this._getResolvedExtension()
    for (const refine of extension.refine) {
      const refined = refine(error as any)
      if (refined && typeof refined === 'object') {
        Object.assign(error as unknown as Record<string, unknown>, refined)
      }
    }
    return error
  }

  private static _fromLikeError0(error: unknown): Error0 {
    const message = this._extractMessage(error)
    if (typeof error !== 'object' || error === null) {
      return this._applyRefine(new this(message, { cause: error }))
    }

    const errorRecord = error as Record<string, unknown>
    const recreated = new this(message)
    const temp = new this(message, { cause: errorRecord })
    const extension = this._getResolvedExtension()
    for (const [key, prop] of Object.entries(extension.props)) {
      const value = prop.output(temp)
      if (value !== undefined) {
        ;(recreated as unknown as Record<string, unknown>)[key] = value
      }
    }
    ;(recreated as unknown as { cause?: unknown }).cause = errorRecord.cause
    if (typeof errorRecord.stack === 'string') {
      recreated.stack = errorRecord.stack
    }
    return this._applyRefine(recreated)
  }

  private static _fromNonError0(error: unknown): Error0 {
    const message = this._extractMessage(error)
    return this._applyRefine(new this(message, { cause: error }))
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

  private static _extendWithExtension(
    this: typeof Error0,
    extension: ErrorExtension<ErrorExtensionProps, ErrorExtensionComputed, ErrorExtensionMethods>,
  ): ClassError0 {
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
        value: function (error: unknown, ...args: unknown[]) {
          return method(this.from(error), ...args)
        },
        writable: true,
        enumerable: true,
        configurable: true,
      })
    }

    return Error0Extended as unknown as ClassError0
  }

  private static _extensionFromBuilder(
    extension: ExtensionError0,
  ): ErrorExtension<ErrorExtensionProps, ErrorExtensionComputed, ErrorExtensionMethods> {
    const extensionRecord = extension as unknown as {
      _extension: ErrorExtension<ErrorExtensionProps, ErrorExtensionComputed, ErrorExtensionMethods>
    }
    return {
      props: { ...(extensionRecord._extension.props ?? {}) },
      computed: { ...(extensionRecord._extension.computed ?? {}) },
      methods: { ...(extensionRecord._extension.methods ?? {}) },
      refine: [...(extensionRecord._extension.refine ?? [])],
    }
  }

  static extend<TThis extends typeof Error0, TBuilder extends ExtensionError0>(
    this: TThis,
    extension: TBuilder,
  ): ClassError0<ExtendErrorExtensionsMap<ExtensionsMapOf<TThis>, ExtensionOfBuilder<TBuilder>>>
  static extend<TThis extends typeof Error0, TKey extends string, TInputValue, TOutputValue>(
    this: TThis,
    kind: 'prop',
    key: TKey,
    value: ErrorExtensionPropOptions<TInputValue, TOutputValue, ErrorInstanceOfMap<ExtensionsMapOf<TThis>>>,
  ): ClassError0<ExtendErrorExtensionsMapWithProp<ExtensionsMapOf<TThis>, TKey, TInputValue, TOutputValue>>
  static extend<TThis extends typeof Error0, TKey extends string, TOutputValue>(
    this: TThis,
    kind: 'computed',
    key: TKey,
    value: ErrorExtensionCopmputedFn<TOutputValue, ErrorInstanceOfMap<ExtensionsMapOf<TThis>>>,
  ): ClassError0<ExtendErrorExtensionsMapWithComputed<ExtensionsMapOf<TThis>, TKey, TOutputValue>>
  static extend<TThis extends typeof Error0, TKey extends string, TArgs extends unknown[], TOutputValue>(
    this: TThis,
    kind: 'method',
    key: TKey,
    value: ErrorExtensionMethodFn<TOutputValue, TArgs, ErrorInstanceOfMap<ExtensionsMapOf<TThis>>>,
  ): ClassError0<ExtendErrorExtensionsMapWithMethod<ExtensionsMapOf<TThis>, TKey, TArgs, TOutputValue>>
  static extend<TThis extends typeof Error0>(
    this: TThis,
    kind: 'refine',
    value: ErrorExtensionRefineFn<ErrorInstanceOfMap<ExtensionsMapOf<TThis>>, ErrorOutputProps<ExtensionsMapOf<TThis>>>,
  ): ClassError0<ExtensionsMapOf<TThis>>
  static extend(
    this: typeof Error0,
    first: ExtensionError0 | 'prop' | 'computed' | 'method' | 'refine',
    key?: string | ErrorExtensionRefineFn<any, any>,
    value?:
      | ErrorExtensionPropOptions<unknown, unknown>
      | ErrorExtensionCopmputedFn<unknown>
      | ErrorExtensionMethodFn<unknown>,
  ): ClassError0 {
    if (first instanceof ExtensionError0) {
      return this._extendWithExtension(this._extensionFromBuilder(first))
    }
    if (first === 'refine') {
      if (typeof key !== 'function') {
        throw new Error('Error0.extend("refine", value) requires refine function')
      }
      return this._extendWithExtension({
        refine: [key],
      })
    }
    if (typeof key !== 'string' || value === undefined) {
      throw new Error('Error0.extend(kind, key, value) requires key and value')
    }

    if (first === 'prop') {
      return this._extendWithExtension({
        props: { [key]: value as ErrorExtensionPropOptions<unknown, unknown> },
      })
    }
    if (first === 'computed') {
      return this._extendWithExtension({
        computed: { [key]: value as ErrorExtensionCopmputedFn<unknown> },
      })
    }
    return this._extendWithExtension({
      methods: { [key]: value as ErrorExtensionMethodFn<unknown> },
    })
  }

  static extension(): ExtensionError0 {
    return new ExtensionError0()
  }

  static serialize(error: unknown, isPublic = true): object {
    const error0 = this.from(error)
    const jsonWithUndefined: Record<string, unknown> = {
      name: error0.name,
      message: error0.message,
      cause: error0.cause,
      stack: error0.stack,
    }

    const extension = this._getResolvedExtension()
    for (const [key, prop] of Object.entries(extension.props)) {
      const value = prop.output(error0)
      const jsonValue = prop.serialize(value, error0, isPublic)
      if (jsonValue !== undefined) {
        jsonWithUndefined[key] = jsonValue
      } else {
        try {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete jsonWithUndefined[key]
        } catch {
          // ignore
        }
      }
    }
    return Object.fromEntries(Object.entries(jsonWithUndefined).filter(([, value]) => value !== undefined)) as object
  }

  serialize(isPublic = true): object {
    const ctor = this.constructor as typeof Error0
    return ctor.serialize(this, isPublic)
  }
}
