export type ErrorExtensionPropOptions<TInputValue, TOutputValue, TError extends Error0 = Error0> = {
  init: (input: TInputValue) => TOutputValue
  resolve: (options: {
    value: TOutputValue | undefined
    flow: Array<TOutputValue | undefined>
    error: TError
  }) => TOutputValue | undefined
  serialize: (options: { value: TOutputValue; error: TError; isPublic: boolean }) => unknown
  deserialize: (options: { value: unknown; serialized: Record<string, unknown> }) => TOutputValue | undefined
}
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
export type ErrorExtensionMethods = { [key: string]: ErrorExtensionMethodFn<any, any[]> }

export type ErrorExtension<
  TProps extends ErrorExtensionProps = Record<never, never>,
  TMethods extends ErrorExtensionMethods = Record<never, never>,
> = {
  props?: TProps
  methods?: TMethods
  refine?: Array<ErrorExtensionRefineFn<Error0, ExtensionOutputProps<TProps>>>
}
type AddPropToExtensionProps<
  TProps extends ErrorExtensionProps,
  TKey extends string,
  TInputValue,
  TOutputValue,
> = TProps & Record<TKey, ErrorExtensionPropOptions<TInputValue, TOutputValue>>
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
  props: Record<string, { init: unknown; resolve: unknown }>
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
          [TKey in keyof TExtensionsMap['props']]: TExtensionsMap['props'][TKey]['init']
        }>

type ErrorOutputProps<TExtensionsMap extends ErrorExtensionsMap> = {
  [TKey in keyof TExtensionsMap['props']]?: TExtensionsMap['props'][TKey]['resolve']
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
  props: Record<never, { init: never; resolve: never }>
  methods: Record<never, ErrorMethodRecord>
}

type ErrorExtensionResolved = {
  props: Record<string, ErrorExtensionPropOptions<unknown, unknown>>
  methods: Record<string, ErrorExtensionMethodFn<unknown>>
  refine: Array<ErrorExtensionRefineFn<Error0, Record<string, unknown>>>
}

type ExtensionPropsMapOf<TExtension extends ErrorExtension> = {
  [TKey in keyof NonNullable<TExtension['props']>]: NonNullable<
    TExtension['props']
  >[TKey] extends ErrorExtensionPropOptions<infer TInputValue, infer TOutputValue>
    ? { init: TInputValue; resolve: TOutputValue }
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
  methods: ExtensionMethodsMapOf<TExtension>
}
type ExtendErrorExtensionsMap<TMap extends ErrorExtensionsMap, TExtension extends ErrorExtension> = {
  props: TMap['props'] & ErrorExtensionsMapOfExtension<TExtension>['props']
  methods: TMap['methods'] & ErrorExtensionsMapOfExtension<TExtension>['methods']
}
type ExtendErrorExtensionsMapWithProp<
  TMap extends ErrorExtensionsMap,
  TKey extends string,
  TInputValue,
  TOutputValue,
> = ExtendErrorExtensionsMap<TMap, ErrorExtension<Record<TKey, ErrorExtensionPropOptions<TInputValue, TOutputValue>>>>
type ExtendErrorExtensionsMapWithMethod<
  TMap extends ErrorExtensionsMap,
  TKey extends string,
  TArgs extends unknown[],
  TOutputValue,
> = ExtendErrorExtensionsMap<
  TMap,
  ErrorExtension<Record<never, never>, Record<TKey, ErrorExtensionMethodFn<TOutputValue, TArgs>>>
>

type ExtensionsMapOf<TClass> = TClass extends { __extensionsMap?: infer TExtensionsMap }
  ? TExtensionsMap extends ErrorExtensionsMap
    ? TExtensionsMap
    : EmptyExtensionsMap
  : EmptyExtensionsMap

type ExtensionsMapFromParts<
  TProps extends ErrorExtensionProps,
  TMethods extends ErrorExtensionMethods,
> = ErrorExtensionsMapOfExtension<ErrorExtension<TProps, TMethods>>
type ErrorInstanceOfMap<TMap extends ErrorExtensionsMap> = Error0 & ErrorOutput<TMap>
type BuilderError0<TProps extends ErrorExtensionProps, TMethods extends ErrorExtensionMethods> = Error0 &
  ErrorOutput<ExtensionsMapFromParts<TProps, TMethods>>

type ExtensionOfBuilder<TBuilder> =
  TBuilder extends ExtensionError0<infer TProps, infer TMethods> ? ErrorExtension<TProps, TMethods> : never

export class ExtensionError0<
  TProps extends ErrorExtensionProps = Record<never, never>,
  TMethods extends ErrorExtensionMethods = Record<never, never>,
> {
  private readonly _extension: ErrorExtension<ErrorExtensionProps, ErrorExtensionMethods>

  readonly Infer = undefined as unknown as {
    props: TProps
    methods: TMethods
  }

  constructor(extension?: ErrorExtension<ErrorExtensionProps, ErrorExtensionMethods>) {
    this._extension = {
      props: { ...(extension?.props ?? {}) },
      methods: { ...(extension?.methods ?? {}) },
      refine: [...(extension?.refine ?? [])],
    }
  }

  prop<TKey extends string, TInputValue, TOutputValue>(
    key: TKey,
    value: ErrorExtensionPropOptions<TInputValue, TOutputValue, BuilderError0<TProps, TMethods>>,
  ): ExtensionError0<AddPropToExtensionProps<TProps, TKey, TInputValue, TOutputValue>, TMethods> {
    return this.extend('prop', key, value)
  }

  method<TKey extends string, TArgs extends unknown[], TOutputValue>(
    key: TKey,
    value: ErrorExtensionMethodFn<TOutputValue, TArgs, BuilderError0<TProps, TMethods>>,
  ): ExtensionError0<TProps, AddMethodToExtensionMethods<TMethods, TKey, TArgs, TOutputValue>> {
    return this.extend('method', key, value)
  }

  refine(
    value: ErrorExtensionRefineFn<BuilderError0<TProps, TMethods>, ExtensionOutputProps<TProps>>,
  ): ExtensionError0<TProps, TMethods> {
    return this.extend('refine', value)
  }

  extend<TKey extends string, TInputValue, TOutputValue>(
    kind: 'prop',
    key: TKey,
    value: ErrorExtensionPropOptions<TInputValue, TOutputValue, BuilderError0<TProps, TMethods>>,
  ): ExtensionError0<AddPropToExtensionProps<TProps, TKey, TInputValue, TOutputValue>, TMethods>
  extend<TKey extends string, TArgs extends unknown[], TOutputValue>(
    kind: 'method',
    key: TKey,
    value: ErrorExtensionMethodFn<TOutputValue, TArgs, BuilderError0<TProps, TMethods>>,
  ): ExtensionError0<TProps, AddMethodToExtensionMethods<TMethods, TKey, TArgs, TOutputValue>>
  extend(
    kind: 'refine',
    value: ErrorExtensionRefineFn<BuilderError0<TProps, TMethods>, ExtensionOutputProps<TProps>>,
  ): ExtensionError0<TProps, TMethods>
  extend(
    kind: 'prop' | 'method' | 'refine',
    keyOrValue: string | ErrorExtensionRefineFn<any, any>,
    value?: ErrorExtensionPropOptions<unknown, unknown, any> | ErrorExtensionMethodFn<unknown, unknown[], any>,
  ): ExtensionError0<any, any> {
    const nextProps: ErrorExtensionProps = { ...(this._extension.props ?? {}) }
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
  serialize: (error: unknown, isPublic?: boolean) => Record<string, unknown>
  prop: <TKey extends string, TInputValue, TOutputValue>(
    key: TKey,
    value: ErrorExtensionPropOptions<TInputValue, TOutputValue, ErrorInstanceOfMap<TExtensionsMap>>,
  ) => ClassError0<ExtendErrorExtensionsMapWithProp<TExtensionsMap, TKey, TInputValue, TOutputValue>>
  method: <TKey extends string, TArgs extends unknown[], TOutputValue>(
    key: TKey,
    value: ErrorExtensionMethodFn<TOutputValue, TArgs, ErrorInstanceOfMap<TExtensionsMap>>,
  ) => ClassError0<ExtendErrorExtensionsMapWithMethod<TExtensionsMap, TKey, TArgs, TOutputValue>>
  refine: (
    value: ErrorExtensionRefineFn<ErrorInstanceOfMap<TExtensionsMap>, ErrorOutputProps<TExtensionsMap>>,
  ) => ClassError0<TExtensionsMap>
  extend: {
    <TBuilder extends ExtensionError0>(
      extension: TBuilder,
    ): ClassError0<ExtendErrorExtensionsMap<TExtensionsMap, ExtensionOfBuilder<TBuilder>>>
    <TKey extends string, TInputValue, TOutputValue>(
      kind: 'prop',
      key: TKey,
      value: ErrorExtensionPropOptions<TInputValue, TOutputValue, ErrorInstanceOfMap<TExtensionsMap>>,
    ): ClassError0<ExtendErrorExtensionsMapWithProp<TExtensionsMap, TKey, TInputValue, TOutputValue>>
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
    methods: {},
    refine: [],
  }

  private static _getResolvedExtension(this: typeof Error0): ErrorExtensionResolved {
    const resolved: ErrorExtensionResolved = {
      props: {},
      methods: {},
      refine: [],
    }
    for (const extension of this._extensions) {
      Object.assign(resolved.props, extension.props ?? this._emptyExtension.props)
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
        ;(this as Record<string, unknown>)[key] = prop.init(ownValue)
      } else {
        Object.defineProperty(this, key, {
          get: () => prop.resolve({ value: undefined, flow: this.flow(key), error: this }),
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

  static flow(error: object, key: string): unknown[] {
    return this.causes(error, true).map((cause) => {
      return this.own(cause, key)
    })
  }
  flow(key: string): unknown[] {
    const ctor = this.constructor as typeof Error0
    return ctor.flow(this, key)
  }

  static causes(error: unknown, instancesOnly?: false): unknown[]
  static causes<T extends typeof Error0>(this: T, error: unknown, instancesOnly: true): Array<InstanceType<T>>
  static causes(error: unknown, instancesOnly?: boolean): unknown[] {
    const causes: unknown[] = []
    let current: unknown = error
    const maxDepth = 99
    const seen = new Set<unknown>()
    for (let depth = 0; depth < maxDepth; depth += 1) {
      if (seen.has(current)) {
        break
      }
      seen.add(current)
      if (!instancesOnly || this.is(current)) {
        causes.push(current)
      }
      if (!current || typeof current !== 'object') {
        break
      }
      current = (current as { cause?: unknown }).cause
    }
    return causes
  }
  causes<T extends typeof Error0>(this: T, instancesOnly?: false): [InstanceType<T>, ...unknown[]]
  causes<T extends typeof Error0>(this: T, instancesOnly: true): [InstanceType<T>, ...Array<InstanceType<T>>]
  causes(instancesOnly?: boolean): unknown[] {
    const ctor = this.constructor as typeof Error0
    if (instancesOnly) {
      return ctor.causes(this, true)
    }
    return ctor.causes(this)
  }

  static is<T extends typeof Error0>(this: T, error: unknown): error is InstanceType<T> {
    return error instanceof this
  }

  static isSerialized(error: unknown): error is Record<string, unknown> {
    return !this.is(error) && typeof error === 'object' && error !== null && 'name' in error && error.name === 'Error0'
  }

  static from(error: unknown): Error0 {
    if (this.is(error)) {
      return error
    }
    if (this.isSerialized(error)) {
      return this._fromSerialized(error)
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

  private static _fromSerialized(error: unknown): Error0 {
    const message = this._extractMessage(error)
    if (typeof error !== 'object' || error === null) {
      return this._applyRefine(new this(message, { cause: error }))
    }
    const errorRecord = error as Record<string, unknown>
    const recreated = new this(message)
    const extension = this._getResolvedExtension()
    const propsEntries = Object.entries(extension.props)
    for (const [key, prop] of propsEntries) {
      if (!(key in errorRecord)) {
        continue
      }
      try {
        const value = prop.deserialize({ value: errorRecord[key], serialized: errorRecord })
        ;(recreated as unknown as Record<string, unknown>)[key] = value
      } catch {
        // ignore
      }
    }
    // we do not serialize causes
    // ;(recreated as unknown as { cause?: unknown }).cause = errorRecord.cause
    const isStackInProps = propsEntries.some(([key]) => key === 'stack')
    if (typeof errorRecord.stack === 'string' && !isStackInProps) {
      recreated.stack = errorRecord.stack
    }
    return recreated
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
    extension: ErrorExtension<ErrorExtensionProps, ErrorExtensionMethods>,
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
  ): ErrorExtension<ErrorExtensionProps, ErrorExtensionMethods> {
    const extensionRecord = extension as unknown as {
      _extension: ErrorExtension<ErrorExtensionProps, ErrorExtensionMethods>
    }
    return {
      props: { ...(extensionRecord._extension.props ?? {}) },
      methods: { ...(extensionRecord._extension.methods ?? {}) },
      refine: [...(extensionRecord._extension.refine ?? [])],
    }
  }

  static prop<TThis extends typeof Error0, TKey extends string, TInputValue, TOutputValue>(
    this: TThis,
    key: TKey,
    value: ErrorExtensionPropOptions<TInputValue, TOutputValue, ErrorInstanceOfMap<ExtensionsMapOf<TThis>>>,
  ): ClassError0<ExtendErrorExtensionsMapWithProp<ExtensionsMapOf<TThis>, TKey, TInputValue, TOutputValue>> {
    return this.extend('prop', key, value)
  }

  static method<TThis extends typeof Error0, TKey extends string, TArgs extends unknown[], TOutputValue>(
    this: TThis,
    key: TKey,
    value: ErrorExtensionMethodFn<TOutputValue, TArgs, ErrorInstanceOfMap<ExtensionsMapOf<TThis>>>,
  ): ClassError0<ExtendErrorExtensionsMapWithMethod<ExtensionsMapOf<TThis>, TKey, TArgs, TOutputValue>> {
    return this.extend('method', key, value)
  }

  static refine<TThis extends typeof Error0>(
    this: TThis,
    value: ErrorExtensionRefineFn<ErrorInstanceOfMap<ExtensionsMapOf<TThis>>, ErrorOutputProps<ExtensionsMapOf<TThis>>>,
  ): ClassError0<ExtensionsMapOf<TThis>> {
    return this.extend('refine', value)
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
    first: ExtensionError0 | 'prop' | 'method' | 'refine',
    key?: string | ErrorExtensionRefineFn<any, any>,
    value?: ErrorExtensionPropOptions<unknown, unknown> | ErrorExtensionMethodFn<unknown>,
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
    return this._extendWithExtension({
      methods: { [key]: value as ErrorExtensionMethodFn<unknown> },
    })
  }

  static extension(): ExtensionError0 {
    return new ExtensionError0()
  }

  static serialize(error: unknown, isPublic = true): Record<string, unknown> {
    const error0 = this.from(error)
    const json: Record<string, unknown> = {
      name: error0.name,
      message: error0.message,
      // we do not serialize causes, it is enough that we have floated props and refine helper
      // cause: error0.cause,
    }

    const extension = this._getResolvedExtension()
    const propsEntries = Object.entries(extension.props)
    for (const [key, prop] of propsEntries) {
      try {
        const value = prop.resolve({ value: error0.own(key), flow: error0.flow(key), error: error0 })
        const jsonValue = prop.serialize({ value, error: error0, isPublic })
        if (jsonValue !== undefined) {
          json[key] = jsonValue
        }
      } catch {
        // ignore
      }
    }
    const isStackInProps = propsEntries.some(([key]) => key === 'stack')
    if (!isStackInProps && typeof error0.stack === 'string') {
      json.stack = error0.stack
    }
    return Object.fromEntries(Object.entries(json).filter(([, value]) => value !== undefined)) as Record<
      string,
      unknown
    >
  }

  serialize(isPublic = true): object {
    const ctor = this.constructor as typeof Error0
    return ctor.serialize(this, isPublic)
  }
}
