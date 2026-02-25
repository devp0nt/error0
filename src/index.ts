export type ErrorPluginPropOptions<TInputValue, TOutputValue, TError extends Error0 = Error0> = {
  init: (input: TInputValue) => TOutputValue
  resolve: (options: {
    value: TOutputValue | undefined
    flow: Array<TOutputValue | undefined>
    error: TError
  }) => TOutputValue | undefined
  serialize: (options: { value: TOutputValue; error: TError; isPublic: boolean }) => unknown
  deserialize: (options: { value: unknown; serialized: Record<string, unknown> }) => TOutputValue | undefined
}
export type ErrorPluginMethodFn<
  TOutputValue,
  TArgs extends unknown[] = unknown[],
  TError extends Error0 = Error0,
> = (error: TError, ...args: TArgs) => TOutputValue
export type ErrorPluginRefineResult<TOutputProps extends Record<string, unknown>> = Partial<TOutputProps> | undefined
export type ErrorPluginRefineFn<
  TError extends Error0 = Error0,
  TOutputProps extends Record<string, unknown> = Record<never, never>,
> = ((error: TError) => void) | ((error: TError) => ErrorPluginRefineResult<TOutputProps>)
type ErrorMethodRecord = {
  args: unknown[]
  output: unknown
}

export type ErrorPluginProps = { [key: string]: ErrorPluginPropOptions<any, any> }
export type ErrorPluginMethods = { [key: string]: ErrorPluginMethodFn<any, any[]> }

export type ErrorPlugin<
  TProps extends ErrorPluginProps = Record<never, never>,
  TMethods extends ErrorPluginMethods = Record<never, never>,
> = {
  props?: TProps
  methods?: TMethods
  refine?: Array<ErrorPluginRefineFn<Error0, PluginOutputProps<TProps>>>
}
type AddPropToPluginProps<
  TProps extends ErrorPluginProps,
  TKey extends string,
  TInputValue,
  TOutputValue,
> = TProps & Record<TKey, ErrorPluginPropOptions<TInputValue, TOutputValue>>
type AddMethodToPluginMethods<
  TMethods extends ErrorPluginMethods,
  TKey extends string,
  TArgs extends unknown[],
  TOutputValue,
> = TMethods & Record<TKey, ErrorPluginMethodFn<TOutputValue, TArgs>>
type PluginOutputProps<TProps extends ErrorPluginProps> = {
  [TKey in keyof TProps]: TProps[TKey] extends ErrorPluginPropOptions<any, infer TOutputValue> ? TOutputValue : never
}
export type ErrorPluginsMap = {
  props: Record<string, { init: unknown; resolve: unknown }>
  methods: Record<string, ErrorMethodRecord>
}
export type IsEmptyObject<T> = keyof T extends never ? true : false
export type ErrorInputBase = {
  cause?: unknown
}
export type ErrorInput<TPluginsMap extends ErrorPluginsMap> =
  IsEmptyObject<TPluginsMap['props']> extends true
    ? ErrorInputBase
    : ErrorInputBase &
        Partial<{
          [TKey in keyof TPluginsMap['props']]: TPluginsMap['props'][TKey]['init']
        }>

type ErrorOutputProps<TPluginsMap extends ErrorPluginsMap> = {
  [TKey in keyof TPluginsMap['props']]?: TPluginsMap['props'][TKey]['resolve']
}
type ErrorOutputMethods<TPluginsMap extends ErrorPluginsMap> = {
  [TKey in keyof TPluginsMap['methods']]: TPluginsMap['methods'][TKey] extends {
    args: infer TArgs extends unknown[]
    output: infer TOutput
  }
    ? (...args: TArgs) => TOutput
    : never
}
export type ErrorOutput<TPluginsMap extends ErrorPluginsMap> = ErrorOutputProps<TPluginsMap> &
  ErrorOutputMethods<TPluginsMap>

type ErrorStaticMethods<TPluginsMap extends ErrorPluginsMap> = {
  [TKey in keyof TPluginsMap['methods']]: TPluginsMap['methods'][TKey] extends {
    args: infer TArgs extends unknown[]
    output: infer TOutput
  }
    ? (error: unknown, ...args: TArgs) => TOutput
    : never
}

type EmptyPluginsMap = {
  props: Record<never, { init: never; resolve: never }>
  methods: Record<never, ErrorMethodRecord>
}

type ErrorPluginResolved = {
  props: Record<string, ErrorPluginPropOptions<unknown, unknown>>
  methods: Record<string, ErrorPluginMethodFn<unknown>>
  refine: Array<ErrorPluginRefineFn<Error0, Record<string, unknown>>>
}

type PluginPropsMapOf<TPlugin extends ErrorPlugin> = {
  [TKey in keyof NonNullable<TPlugin['props']>]: NonNullable<TPlugin['props']>[TKey] extends ErrorPluginPropOptions<
    infer TInputValue,
    infer TOutputValue
  >
    ? { init: TInputValue; resolve: TOutputValue }
    : never
}
type PluginMethodsMapOf<TPlugin extends ErrorPlugin> = {
  [TKey in keyof NonNullable<TPlugin['methods']>]: NonNullable<TPlugin['methods']>[TKey] extends (
    error: Error0,
    ...args: infer TArgs extends unknown[]
  ) => infer TOutput
    ? { args: TArgs; output: TOutput }
    : never
}
type ErrorPluginsMapOfPlugin<TPlugin extends ErrorPlugin> = {
  props: PluginPropsMapOf<TPlugin>
  methods: PluginMethodsMapOf<TPlugin>
}
type ExtendErrorPluginsMap<TMap extends ErrorPluginsMap, TPlugin extends ErrorPlugin> = {
  props: TMap['props'] & ErrorPluginsMapOfPlugin<TPlugin>['props']
  methods: TMap['methods'] & ErrorPluginsMapOfPlugin<TPlugin>['methods']
}
type ExtendErrorPluginsMapWithProp<
  TMap extends ErrorPluginsMap,
  TKey extends string,
  TInputValue,
  TOutputValue,
> = ExtendErrorPluginsMap<TMap, ErrorPlugin<Record<TKey, ErrorPluginPropOptions<TInputValue, TOutputValue>>>>
type ExtendErrorPluginsMapWithMethod<
  TMap extends ErrorPluginsMap,
  TKey extends string,
  TArgs extends unknown[],
  TOutputValue,
> = ExtendErrorPluginsMap<
  TMap,
  ErrorPlugin<Record<never, never>, Record<TKey, ErrorPluginMethodFn<TOutputValue, TArgs>>>
>

type PluginsMapOf<TClass> = TClass extends { __pluginsMap?: infer TPluginsMap }
  ? TPluginsMap extends ErrorPluginsMap
    ? TPluginsMap
    : EmptyPluginsMap
  : EmptyPluginsMap

type PluginsMapFromParts<TProps extends ErrorPluginProps, TMethods extends ErrorPluginMethods> = ErrorPluginsMapOfPlugin<
  ErrorPlugin<TProps, TMethods>
>
type ErrorInstanceOfMap<TMap extends ErrorPluginsMap> = Error0 & ErrorOutput<TMap>
type BuilderError0<TProps extends ErrorPluginProps, TMethods extends ErrorPluginMethods> = Error0 &
  ErrorOutput<PluginsMapFromParts<TProps, TMethods>>

type PluginOfBuilder<TBuilder> = TBuilder extends PluginError0<infer TProps, infer TMethods>
  ? ErrorPlugin<TProps, TMethods>
  : never

export class PluginError0<
  TProps extends ErrorPluginProps = Record<never, never>,
  TMethods extends ErrorPluginMethods = Record<never, never>,
> {
  private readonly _plugin: ErrorPlugin<ErrorPluginProps, ErrorPluginMethods>

  readonly Infer = undefined as unknown as {
    props: TProps
    methods: TMethods
  }

  constructor(plugin?: ErrorPlugin<ErrorPluginProps, ErrorPluginMethods>) {
    this._plugin = {
      props: { ...(plugin?.props ?? {}) },
      methods: { ...(plugin?.methods ?? {}) },
      refine: [...(plugin?.refine ?? [])],
    }
  }

  prop<TKey extends string, TInputValue, TOutputValue>(
    key: TKey,
    value: ErrorPluginPropOptions<TInputValue, TOutputValue, BuilderError0<TProps, TMethods>>,
  ): PluginError0<AddPropToPluginProps<TProps, TKey, TInputValue, TOutputValue>, TMethods> {
    return this.use('prop', key, value)
  }

  method<TKey extends string, TArgs extends unknown[], TOutputValue>(
    key: TKey,
    value: ErrorPluginMethodFn<TOutputValue, TArgs, BuilderError0<TProps, TMethods>>,
  ): PluginError0<TProps, AddMethodToPluginMethods<TMethods, TKey, TArgs, TOutputValue>> {
    return this.use('method', key, value)
  }

  refine(
    value: ErrorPluginRefineFn<BuilderError0<TProps, TMethods>, PluginOutputProps<TProps>>,
  ): PluginError0<TProps, TMethods> {
    return this.use('refine', value)
  }

  use<TKey extends string, TInputValue, TOutputValue>(
    kind: 'prop',
    key: TKey,
    value: ErrorPluginPropOptions<TInputValue, TOutputValue, BuilderError0<TProps, TMethods>>,
  ): PluginError0<AddPropToPluginProps<TProps, TKey, TInputValue, TOutputValue>, TMethods>
  use<TKey extends string, TArgs extends unknown[], TOutputValue>(
    kind: 'method',
    key: TKey,
    value: ErrorPluginMethodFn<TOutputValue, TArgs, BuilderError0<TProps, TMethods>>,
  ): PluginError0<TProps, AddMethodToPluginMethods<TMethods, TKey, TArgs, TOutputValue>>
  use(
    kind: 'refine',
    value: ErrorPluginRefineFn<BuilderError0<TProps, TMethods>, PluginOutputProps<TProps>>,
  ): PluginError0<TProps, TMethods>
  use(
    kind: 'prop' | 'method' | 'refine',
    keyOrValue: string | ErrorPluginRefineFn<any, any>,
    value?: ErrorPluginPropOptions<unknown, unknown, any> | ErrorPluginMethodFn<unknown, unknown[], any>,
  ): PluginError0<any, any> {
    const nextProps: ErrorPluginProps = { ...(this._plugin.props ?? {}) }
    const nextMethods: ErrorPluginMethods = { ...(this._plugin.methods ?? {}) }
    const nextRefine: Array<ErrorPluginRefineFn<Error0, Record<string, unknown>>> = [
      ...(this._plugin.refine ?? []),
    ]
    if (kind === 'prop') {
      const key = keyOrValue as string
      if (value === undefined) {
        throw new Error('PluginError0.use("prop", key, value) requires value')
      }
      nextProps[key] = value as ErrorPluginPropOptions<any, any>
    } else if (kind === 'method') {
      const key = keyOrValue as string
      if (value === undefined) {
        throw new Error('PluginError0.use("method", key, value) requires value')
      }
      nextMethods[key] = value as ErrorPluginMethodFn<any, any[]>
    } else {
      nextRefine.push(keyOrValue as ErrorPluginRefineFn<Error0, Record<string, unknown>>)
    }
    return new PluginError0({
      props: nextProps,
      methods: nextMethods,
      refine: nextRefine,
    })
  }
}

export type ClassError0<TPluginsMap extends ErrorPluginsMap = EmptyPluginsMap> = {
  new (message: string, input?: ErrorInput<TPluginsMap>): Error0 & ErrorOutput<TPluginsMap>
  new (input: { message: string } & ErrorInput<TPluginsMap>): Error0 & ErrorOutput<TPluginsMap>
  readonly __pluginsMap?: TPluginsMap
  from: (error: unknown) => Error0 & ErrorOutput<TPluginsMap>
  serialize: (error: unknown, isPublic?: boolean) => Record<string, unknown>
  prop: <TKey extends string, TInputValue, TOutputValue>(
    key: TKey,
    value: ErrorPluginPropOptions<TInputValue, TOutputValue, ErrorInstanceOfMap<TPluginsMap>>,
  ) => ClassError0<ExtendErrorPluginsMapWithProp<TPluginsMap, TKey, TInputValue, TOutputValue>>
  method: <TKey extends string, TArgs extends unknown[], TOutputValue>(
    key: TKey,
    value: ErrorPluginMethodFn<TOutputValue, TArgs, ErrorInstanceOfMap<TPluginsMap>>,
  ) => ClassError0<ExtendErrorPluginsMapWithMethod<TPluginsMap, TKey, TArgs, TOutputValue>>
  refine: (
    value: ErrorPluginRefineFn<ErrorInstanceOfMap<TPluginsMap>, ErrorOutputProps<TPluginsMap>>,
  ) => ClassError0<TPluginsMap>
  use: {
    <TBuilder extends PluginError0>(plugin: TBuilder): ClassError0<ExtendErrorPluginsMap<TPluginsMap, PluginOfBuilder<TBuilder>>>
    <TKey extends string, TInputValue, TOutputValue>(
      kind: 'prop',
      key: TKey,
      value: ErrorPluginPropOptions<TInputValue, TOutputValue, ErrorInstanceOfMap<TPluginsMap>>,
    ): ClassError0<ExtendErrorPluginsMapWithProp<TPluginsMap, TKey, TInputValue, TOutputValue>>
    <TKey extends string, TArgs extends unknown[], TOutputValue>(
      kind: 'method',
      key: TKey,
      value: ErrorPluginMethodFn<TOutputValue, TArgs, ErrorInstanceOfMap<TPluginsMap>>,
    ): ClassError0<ExtendErrorPluginsMapWithMethod<TPluginsMap, TKey, TArgs, TOutputValue>>
    (
      kind: 'refine',
      value: ErrorPluginRefineFn<ErrorInstanceOfMap<TPluginsMap>, ErrorOutputProps<TPluginsMap>>,
    ): ClassError0<TPluginsMap>
  }
  plugin: () => PluginError0
} & ErrorStaticMethods<TPluginsMap>

export class Error0 extends Error {
  static readonly __pluginsMap?: EmptyPluginsMap
  protected static _plugins: ErrorPlugin[] = []

  private static readonly _emptyPlugin: ErrorPluginResolved = {
    props: {},
    methods: {},
    refine: [],
  }

  private static _getResolvedPlugin(this: typeof Error0): ErrorPluginResolved {
    const resolved: ErrorPluginResolved = {
      props: {},
      methods: {},
      refine: [],
    }
    for (const plugin of this._plugins) {
      Object.assign(resolved.props, plugin.props ?? this._emptyPlugin.props)
      Object.assign(resolved.methods, plugin.methods ?? this._emptyPlugin.methods)
      resolved.refine.push(...(plugin.refine ?? this._emptyPlugin.refine))
    }
    return resolved
  }

  constructor(message: string, input?: ErrorInput<EmptyPluginsMap>)
  constructor(input: { message: string } & ErrorInput<EmptyPluginsMap>)
  constructor(
    ...args:
      | [message: string, input?: ErrorInput<EmptyPluginsMap>]
      | [{ message: string } & ErrorInput<EmptyPluginsMap>]
  ) {
    const [first, second] = args
    const input = typeof first === 'string' ? { message: first, ...(second ?? {}) } : first

    super(input.message, { cause: input.cause })
    this.name = 'Error0'

    const ctor = this.constructor as typeof Error0
    const plugin = ctor._getResolvedPlugin()

    for (const [key, prop] of Object.entries(plugin.props)) {
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
    const plugin = this._getResolvedPlugin()
    for (const refine of plugin.refine) {
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
    const plugin = this._getResolvedPlugin()
    const propsEntries = Object.entries(plugin.props)
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

  private static _useWithPlugin(
    this: typeof Error0,
    plugin: ErrorPlugin<ErrorPluginProps, ErrorPluginMethods>,
  ): ClassError0 {
    const Base = this as unknown as typeof Error0
    const Error0Extended = class Error0 extends Base {}
    ;(Error0Extended as typeof Error0)._plugins = [...Base._plugins, plugin]

    const resolved = (Error0Extended as typeof Error0)._getResolvedPlugin()
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

  private static _pluginFromBuilder(plugin: PluginError0): ErrorPlugin<ErrorPluginProps, ErrorPluginMethods> {
    const pluginRecord = plugin as unknown as {
      _plugin: ErrorPlugin<ErrorPluginProps, ErrorPluginMethods>
    }
    return {
      props: { ...(pluginRecord._plugin.props ?? {}) },
      methods: { ...(pluginRecord._plugin.methods ?? {}) },
      refine: [...(pluginRecord._plugin.refine ?? [])],
    }
  }

  static prop<TThis extends typeof Error0, TKey extends string, TInputValue, TOutputValue>(
    this: TThis,
    key: TKey,
    value: ErrorPluginPropOptions<TInputValue, TOutputValue, ErrorInstanceOfMap<PluginsMapOf<TThis>>>,
  ): ClassError0<ExtendErrorPluginsMapWithProp<PluginsMapOf<TThis>, TKey, TInputValue, TOutputValue>> {
    return this.use('prop', key, value)
  }

  static method<TThis extends typeof Error0, TKey extends string, TArgs extends unknown[], TOutputValue>(
    this: TThis,
    key: TKey,
    value: ErrorPluginMethodFn<TOutputValue, TArgs, ErrorInstanceOfMap<PluginsMapOf<TThis>>>,
  ): ClassError0<ExtendErrorPluginsMapWithMethod<PluginsMapOf<TThis>, TKey, TArgs, TOutputValue>> {
    return this.use('method', key, value)
  }

  static refine<TThis extends typeof Error0>(
    this: TThis,
    value: ErrorPluginRefineFn<ErrorInstanceOfMap<PluginsMapOf<TThis>>, ErrorOutputProps<PluginsMapOf<TThis>>>,
  ): ClassError0<PluginsMapOf<TThis>> {
    return this.use('refine', value)
  }

  static use<TThis extends typeof Error0, TBuilder extends PluginError0>(
    this: TThis,
    plugin: TBuilder,
  ): ClassError0<ExtendErrorPluginsMap<PluginsMapOf<TThis>, PluginOfBuilder<TBuilder>>>
  static use<TThis extends typeof Error0, TKey extends string, TInputValue, TOutputValue>(
    this: TThis,
    kind: 'prop',
    key: TKey,
    value: ErrorPluginPropOptions<TInputValue, TOutputValue, ErrorInstanceOfMap<PluginsMapOf<TThis>>>,
  ): ClassError0<ExtendErrorPluginsMapWithProp<PluginsMapOf<TThis>, TKey, TInputValue, TOutputValue>>
  static use<TThis extends typeof Error0, TKey extends string, TArgs extends unknown[], TOutputValue>(
    this: TThis,
    kind: 'method',
    key: TKey,
    value: ErrorPluginMethodFn<TOutputValue, TArgs, ErrorInstanceOfMap<PluginsMapOf<TThis>>>,
  ): ClassError0<ExtendErrorPluginsMapWithMethod<PluginsMapOf<TThis>, TKey, TArgs, TOutputValue>>
  static use<TThis extends typeof Error0>(
    this: TThis,
    kind: 'refine',
    value: ErrorPluginRefineFn<ErrorInstanceOfMap<PluginsMapOf<TThis>>, ErrorOutputProps<PluginsMapOf<TThis>>>,
  ): ClassError0<PluginsMapOf<TThis>>
  static use(
    this: typeof Error0,
    first: PluginError0 | 'prop' | 'method' | 'refine',
    key?: string | ErrorPluginRefineFn<any, any>,
    value?: ErrorPluginPropOptions<unknown, unknown> | ErrorPluginMethodFn<unknown>,
  ): ClassError0 {
    if (first instanceof PluginError0) {
      return this._useWithPlugin(this._pluginFromBuilder(first))
    }
    if (first === 'refine') {
      if (typeof key !== 'function') {
        throw new Error('Error0.use("refine", value) requires refine function')
      }
      return this._useWithPlugin({
        refine: [key],
      })
    }
    if (typeof key !== 'string' || value === undefined) {
      throw new Error('Error0.use(kind, key, value) requires key and value')
    }

    if (first === 'prop') {
      return this._useWithPlugin({
        props: { [key]: value as ErrorPluginPropOptions<unknown, unknown> },
      })
    }
    return this._useWithPlugin({
      methods: { [key]: value as ErrorPluginMethodFn<unknown> },
    })
  }

  static plugin(): PluginError0 {
    return new PluginError0()
  }

  static serialize(error: unknown, isPublic = true): Record<string, unknown> {
    const error0 = this.from(error)
    const json: Record<string, unknown> = {
      name: error0.name,
      message: error0.message,
      // we do not serialize causes, it is enough that we have floated props and refine helper
      // cause: error0.cause,
    }

    const plugin = this._getResolvedPlugin()
    const propsEntries = Object.entries(plugin.props)
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
