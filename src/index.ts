// Эррор плагины все с намтройками
// Не сериалайзед а рекорд
// И в сериалайз тоже добавить оун резолвед и флоу
// Not console error but add error text to json

type IsUnknown<T> = unknown extends T ? ([T] extends [unknown] ? true : false) : false
type NormalizeUnknownToUndefined<T> = IsUnknown<T> extends true ? undefined : T
type IsOnlyUndefined<T> = [Exclude<T, undefined>] extends [never] ? true : false
type InferFirstArg<TFn> = TFn extends (...args: infer TArgs) => unknown
  ? TArgs extends [infer TFirst, ...unknown[]]
    ? TFirst
    : undefined
  : undefined
type InferPluginPropInput<TProp extends ErrorPluginPropOptions<any, any, any, any>> = TProp extends {
  init: infer TInit
}
  ? NormalizeUnknownToUndefined<InferFirstArg<TInit>>
  : undefined
type ErrorPluginPropInit<TInputValue, TOutputValue> = ((input: TInputValue) => TOutputValue) | (() => TOutputValue)
type ErrorPluginPropSerializeOptions<
  TOutputValue,
  TError extends Error0,
  TResolveValue extends TOutputValue | undefined,
> = {
  own: TOutputValue | undefined
  flow: Array<TOutputValue | undefined>
  resolved: TResolveValue
  error: TError
  isPublic: boolean
}
type ErrorPluginPropSerialize<TOutputValue, TError extends Error0, TResolveValue extends TOutputValue | undefined> =
  | ((options: ErrorPluginPropSerializeOptions<TOutputValue, TError, TResolveValue>) => unknown)
  | false
type ErrorPluginPropDeserialize<TOutputValue> =
  | ((options: { value: unknown; record: Record<string, unknown> }) => TOutputValue | undefined)
  | false
type ErrorPluginPropOptionsResolveOptions<TOutputValue, TError extends Error0> = {
  own: TOutputValue | undefined
  flow: Array<TOutputValue | undefined>
  error: TError
}
type ErrorPluginPropOptionsBase<TOutputValue, TError extends Error0, TResolveValue extends TOutputValue | undefined> = {
  resolve: (options: ErrorPluginPropOptionsResolveOptions<TOutputValue, TError>) => TResolveValue
  serialize: ErrorPluginPropSerialize<TOutputValue, TError, TResolveValue>
  deserialize: ErrorPluginPropDeserialize<TOutputValue>
}
type ErrorPluginPropOptionsWithInit<
  TInputValue,
  TOutputValue,
  TError extends Error0,
  TResolveValue extends TOutputValue | undefined,
> = ErrorPluginPropOptionsBase<TOutputValue, TError, TResolveValue> & {
  init: ErrorPluginPropInit<TInputValue, TOutputValue>
}
type ErrorPluginPropOptionsWithoutInit<
  TOutputValue,
  TError extends Error0,
  TResolveValue extends TOutputValue | undefined,
> = ErrorPluginPropOptionsBase<TOutputValue, TError, TResolveValue> & {
  init?: undefined
}
export type ErrorPluginPropOptions<
  TInputValue = undefined,
  TOutputValue = unknown,
  TError extends Error0 = Error0,
  TResolveValue extends TOutputValue | undefined = TOutputValue | undefined,
> =
  | ErrorPluginPropOptionsWithInit<TInputValue, TOutputValue, TError, TResolveValue>
  | ErrorPluginPropOptionsWithoutInit<TOutputValue, TError, TResolveValue>
export type ErrorPluginMethodFn<TOutputValue, TArgs extends unknown[] = unknown[], TError extends Error0 = Error0> = (
  error: TError,
  ...args: TArgs
) => TOutputValue
export type ErrorPluginAdaptResult<TOutputProps extends Record<string, unknown>> = Partial<TOutputProps> | undefined
export type ErrorPluginAdaptFn<
  TError extends Error0 = Error0,
  TOutputProps extends Record<string, unknown> = Record<never, never>,
> = ((error: TError) => void) | ((error: TError) => ErrorPluginAdaptResult<TOutputProps>)
export type ErrorPluginStackSerialize<TError extends Error0> = (options: {
  value: string | undefined
  error: TError
  isPublic: boolean
}) => unknown
export type ErrorPluginStack<TError extends Error0 = Error0> = { serialize: ErrorPluginStackSerialize<TError> }
export type ErrorPluginCauseSerialize<TError extends Error0> = (options: {
  value: unknown
  error: TError
  isPublic: boolean
}) => unknown
export type ErrorPluginCause<TError extends Error0 = Error0> = { serialize: ErrorPluginCauseSerialize<TError> }
export type ErrorPluginMessageSerialize<TError extends Error0> = (options: {
  value: string
  error: TError
  isPublic: boolean
}) => unknown
export type ErrorPluginMessage<TError extends Error0 = Error0> = { serialize: ErrorPluginMessageSerialize<TError> }
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
  adapt?: Array<ErrorPluginAdaptFn<Error0, PluginOutputProps<TProps>>>
  stack?: ErrorPluginStack
  cause?: ErrorPluginCause
  message?: ErrorPluginMessage
}
type AddPropToPluginProps<
  TProps extends ErrorPluginProps,
  TKey extends string,
  TInputValue,
  TOutputValue,
  TResolveValue extends TOutputValue | undefined = TOutputValue | undefined,
> = TProps & Record<TKey, ErrorPluginPropOptions<TInputValue, TOutputValue, Error0, TResolveValue>>
type AddMethodToPluginMethods<
  TMethods extends ErrorPluginMethods,
  TKey extends string,
  TArgs extends unknown[],
  TOutputValue,
> = TMethods & Record<TKey, ErrorPluginMethodFn<TOutputValue, TArgs>>
type PluginOutputProps<TProps extends ErrorPluginProps> = {
  [TKey in keyof TProps]: TProps[TKey] extends ErrorPluginPropOptions<any, any, any, infer TResolveValue>
    ? TResolveValue
    : never
}
export type ErrorPluginsMap = {
  props: Record<string, { init: unknown; output: unknown; resolve: unknown }>
  methods: Record<string, ErrorMethodRecord>
}
export type IsEmptyObject<T> = keyof T extends never ? true : false
export type ErrorInputBase = {
  cause?: unknown
}
type ErrorInputPluginProps<TPluginsMap extends ErrorPluginsMap> = {
  [TKey in keyof TPluginsMap['props'] as IsOnlyUndefined<TPluginsMap['props'][TKey]['init']> extends true
    ? never
    : TKey]?: TPluginsMap['props'][TKey]['init']
}
export type ErrorInput<TPluginsMap extends ErrorPluginsMap> =
  IsEmptyObject<TPluginsMap['props']> extends true
    ? ErrorInputBase
    : ErrorInputBase & ErrorInputPluginProps<TPluginsMap>

type ErrorResolvedProps<TPluginsMap extends ErrorPluginsMap> = {
  [TKey in keyof TPluginsMap['props']]: TPluginsMap['props'][TKey]['resolve']
}
type ErrorOwnProps<TPluginsMap extends ErrorPluginsMap> = {
  [TKey in keyof TPluginsMap['props']]: TPluginsMap['props'][TKey]['output'] | undefined
}
type ErrorOwnMethods<TPluginsMap extends ErrorPluginsMap> = {
  own: {
    (): ErrorOwnProps<TPluginsMap>
    <TKey extends keyof TPluginsMap['props'] & string>(key: TKey): ErrorOwnProps<TPluginsMap>[TKey]
  }
  flow: <TKey extends keyof TPluginsMap['props'] & string>(key: TKey) => Array<ErrorOwnProps<TPluginsMap>[TKey]>
}
type ErrorResolveMethods<TPluginsMap extends ErrorPluginsMap> = {
  resolve: () => ErrorResolvedProps<TPluginsMap>
}
type ErrorMethods<TPluginsMap extends ErrorPluginsMap> = {
  [TKey in keyof TPluginsMap['methods']]: TPluginsMap['methods'][TKey] extends {
    args: infer TArgs extends unknown[]
    output: infer TOutput
  }
    ? (...args: TArgs) => TOutput
    : never
}
export type ErrorResolved<TPluginsMap extends ErrorPluginsMap> = ErrorResolvedProps<TPluginsMap> &
  ErrorMethods<TPluginsMap>

type ErrorStaticMethods<TPluginsMap extends ErrorPluginsMap> = {
  [TKey in keyof TPluginsMap['methods']]: TPluginsMap['methods'][TKey] extends {
    args: infer TArgs extends unknown[]
    output: infer TOutput
  }
    ? (error: unknown, ...args: TArgs) => TOutput
    : never
}

type EmptyPluginsMap = {
  props: Record<never, { init: never; output: never; resolve: never }>
  methods: Record<never, ErrorMethodRecord>
}

type ErrorPluginResolved = {
  props: Record<string, ErrorPluginPropOptions<unknown>>
  methods: Record<string, ErrorPluginMethodFn<unknown>>
  adapt: Array<ErrorPluginAdaptFn<Error0, Record<string, unknown>>>
  stack?: ErrorPluginStack
  cause?: ErrorPluginCause
  message?: ErrorPluginMessage
}
const RESERVED_STACK_PROP_ERROR = 'Error0: "stack" is a reserved prop key. Use .stack(...) plugin API instead'
const RESERVED_MESSAGE_PROP_ERROR = 'Error0: "message" is a reserved prop key. Use .message(...) plugin API instead'

type PluginPropsMapOf<TPlugin extends ErrorPlugin> = {
  [TKey in keyof NonNullable<TPlugin['props']>]: NonNullable<TPlugin['props']>[TKey] extends ErrorPluginPropOptions<
    any,
    infer TOutputValue,
    any,
    infer TResolveValue
  >
    ? {
        init: InferPluginPropInput<NonNullable<TPlugin['props']>[TKey]>
        output: TOutputValue
        resolve: TResolveValue
      }
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
  TResolveValue extends TOutputValue | undefined = TOutputValue | undefined,
> = ExtendErrorPluginsMap<
  TMap,
  ErrorPlugin<Record<TKey, ErrorPluginPropOptions<TInputValue, TOutputValue, Error0, TResolveValue>>>
>
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
type PluginsMapOfInstance<TInstance> = TInstance extends { __pluginsMap?: infer TPluginsMap }
  ? TPluginsMap extends ErrorPluginsMap
    ? TPluginsMap
    : EmptyPluginsMap
  : EmptyPluginsMap

type PluginsMapFromParts<
  TProps extends ErrorPluginProps,
  TMethods extends ErrorPluginMethods,
> = ErrorPluginsMapOfPlugin<ErrorPlugin<TProps, TMethods>>
type ErrorInstanceOfMap<TMap extends ErrorPluginsMap> = Error0 &
  ErrorResolved<TMap> &
  ErrorOwnMethods<TMap> &
  ErrorResolveMethods<TMap> & { readonly __pluginsMap?: TMap }
type BuilderError0<TProps extends ErrorPluginProps, TMethods extends ErrorPluginMethods> = Error0 &
  ErrorResolved<PluginsMapFromParts<TProps, TMethods>> &
  ErrorOwnMethods<PluginsMapFromParts<TProps, TMethods>> &
  ErrorResolveMethods<PluginsMapFromParts<TProps, TMethods>> & {
    readonly __pluginsMap?: PluginsMapFromParts<TProps, TMethods>
  }

type PluginOfBuilder<TBuilder> =
  TBuilder extends PluginError0<infer TProps, infer TMethods> ? ErrorPlugin<TProps, TMethods> : never

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
      adapt: [...(plugin?.adapt ?? [])],
      stack: plugin?.stack,
      cause: plugin?.cause,
      message: plugin?.message,
    }
  }

  prop<
    TKey extends string,
    TInputValue = undefined,
    TOutputValue = unknown,
    TResolveValue extends TOutputValue | undefined = TOutputValue | undefined,
  >(
    key: TKey,
    value: ErrorPluginPropOptions<TInputValue, TOutputValue, BuilderError0<TProps, TMethods>, TResolveValue>,
  ): PluginError0<AddPropToPluginProps<TProps, TKey, TInputValue, TOutputValue, TResolveValue>, TMethods> {
    return this.use('prop', key, value)
  }

  method<TKey extends string, TArgs extends unknown[], TOutputValue>(
    key: TKey,
    value: ErrorPluginMethodFn<TOutputValue, TArgs, BuilderError0<TProps, TMethods>>,
  ): PluginError0<TProps, AddMethodToPluginMethods<TMethods, TKey, TArgs, TOutputValue>> {
    return this.use('method', key, value)
  }

  adapt(
    value: ErrorPluginAdaptFn<BuilderError0<TProps, TMethods>, PluginOutputProps<TProps>>,
  ): PluginError0<TProps, TMethods> {
    return this.use('adapt', value)
  }

  stack(value: ErrorPluginStack<BuilderError0<TProps, TMethods>>): PluginError0<TProps, TMethods> {
    return this.use('stack', value)
  }

  cause(value: ErrorPluginCause<BuilderError0<TProps, TMethods>>): PluginError0<TProps, TMethods> {
    return this.use('cause', value)
  }

  message(value: ErrorPluginMessage<BuilderError0<TProps, TMethods>>): PluginError0<TProps, TMethods> {
    return this.use('message', value)
  }

  use<
    TKey extends string,
    TInputValue = undefined,
    TOutputValue = unknown,
    TResolveValue extends TOutputValue | undefined = TOutputValue | undefined,
  >(
    kind: 'prop',
    key: TKey,
    value: ErrorPluginPropOptions<TInputValue, TOutputValue, BuilderError0<TProps, TMethods>, TResolveValue>,
  ): PluginError0<AddPropToPluginProps<TProps, TKey, TInputValue, TOutputValue, TResolveValue>, TMethods>
  use<TKey extends string, TArgs extends unknown[], TOutputValue>(
    kind: 'method',
    key: TKey,
    value: ErrorPluginMethodFn<TOutputValue, TArgs, BuilderError0<TProps, TMethods>>,
  ): PluginError0<TProps, AddMethodToPluginMethods<TMethods, TKey, TArgs, TOutputValue>>
  use(
    kind: 'adapt',
    value: ErrorPluginAdaptFn<BuilderError0<TProps, TMethods>, PluginOutputProps<TProps>>,
  ): PluginError0<TProps, TMethods>
  use(kind: 'stack', value: ErrorPluginStack<BuilderError0<TProps, TMethods>>): PluginError0<TProps, TMethods>
  use(kind: 'cause', value: ErrorPluginCause<BuilderError0<TProps, TMethods>>): PluginError0<TProps, TMethods>
  use(kind: 'message', value: ErrorPluginMessage<BuilderError0<TProps, TMethods>>): PluginError0<TProps, TMethods>
  use(
    kind: 'prop' | 'method' | 'adapt' | 'stack' | 'cause' | 'message',
    keyOrValue: unknown,
    value?: ErrorPluginPropOptions<unknown, unknown, any> | ErrorPluginMethodFn<unknown, unknown[], any>,
  ): PluginError0<any, any> {
    const nextProps: ErrorPluginProps = { ...(this._plugin.props ?? {}) }
    const nextMethods: ErrorPluginMethods = { ...(this._plugin.methods ?? {}) }
    const nextAdapt: Array<ErrorPluginAdaptFn<Error0, Record<string, unknown>>> = [...(this._plugin.adapt ?? [])]
    let nextStack: ErrorPluginStack | undefined = this._plugin.stack
    let nextCause: ErrorPluginCause | undefined = this._plugin.cause
    let nextMessage: ErrorPluginMessage | undefined = this._plugin.message
    if (kind === 'prop') {
      const key = keyOrValue as string
      if (key === 'stack') {
        throw new Error(RESERVED_STACK_PROP_ERROR)
      }
      if (key === 'message') {
        throw new Error(RESERVED_MESSAGE_PROP_ERROR)
      }
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
    } else if (kind === 'adapt') {
      nextAdapt.push(keyOrValue as ErrorPluginAdaptFn<Error0, Record<string, unknown>>)
    } else if (kind === 'stack') {
      nextStack = keyOrValue as ErrorPluginStack
    } else if (kind === 'cause') {
      nextCause = keyOrValue as ErrorPluginCause
    } else {
      nextMessage = keyOrValue as ErrorPluginMessage
    }
    return new PluginError0({
      props: nextProps,
      methods: nextMethods,
      adapt: nextAdapt,
      stack: nextStack,
      cause: nextCause,
      message: nextMessage,
    })
  }
}

const OWN_SYMBOL: unique symbol = Symbol('Error0.own')
type ErrorOwnStore = Record<string, unknown>

export type ClassError0<TPluginsMap extends ErrorPluginsMap = EmptyPluginsMap> = {
  new (
    message: string,
    input?: ErrorInput<TPluginsMap>,
  ): Error0 &
    ErrorResolved<TPluginsMap> &
    ErrorOwnMethods<TPluginsMap> &
    ErrorResolveMethods<TPluginsMap> & { readonly __pluginsMap?: TPluginsMap }
  new (
    input: { message: string } & ErrorInput<TPluginsMap>,
  ): Error0 &
    ErrorResolved<TPluginsMap> &
    ErrorOwnMethods<TPluginsMap> &
    ErrorResolveMethods<TPluginsMap> & { readonly __pluginsMap?: TPluginsMap }
  readonly __pluginsMap?: TPluginsMap
  from: (
    error: unknown,
  ) => Error0 & ErrorResolved<TPluginsMap> & ErrorOwnMethods<TPluginsMap> & ErrorResolveMethods<TPluginsMap>
  round: (
    error: unknown,
    isPublic?: boolean,
  ) => Error0 & ErrorResolved<TPluginsMap> & ErrorOwnMethods<TPluginsMap> & ErrorResolveMethods<TPluginsMap>
  resolve: (error: unknown) => ErrorResolvedProps<TPluginsMap>
  serialize: (error: unknown, isPublic?: boolean) => Record<string, unknown>
  own: {
    (error: object): ErrorOwnProps<TPluginsMap>
    <TKey extends keyof TPluginsMap['props'] & string>(error: object, key: TKey): ErrorOwnProps<TPluginsMap>[TKey]
  }
  flow: <TKey extends keyof TPluginsMap['props'] & string>(
    error: object,
    key: TKey,
  ) => Array<ErrorOwnProps<TPluginsMap>[TKey]>
  // prop: <
  //   TKey extends string,
  //   TInputValue = undefined,
  //   TOutputValue = unknown,
  //   TResolveValue extends TOutputValue | undefined = TOutputValue | undefined,
  // >(
  //   key: TKey,
  //   value: ErrorPluginPropOptions<TInputValue, TOutputValue, ErrorInstanceOfMap<TPluginsMap>, TResolveValue>,
  // ) => ClassError0<ExtendErrorPluginsMapWithProp<TPluginsMap, TKey, TInputValue, TOutputValue, TResolveValue>>
  // method: <TKey extends string, TArgs extends unknown[], TOutputValue>(
  //   key: TKey,
  //   value: ErrorPluginMethodFn<TOutputValue, TArgs, ErrorInstanceOfMap<TPluginsMap>>,
  // ) => ClassError0<ExtendErrorPluginsMapWithMethod<TPluginsMap, TKey, TArgs, TOutputValue>>
  // adapt: (
  //   value: ErrorPluginAdaptFn<ErrorInstanceOfMap<TPluginsMap>, ErrorResolvedProps<TPluginsMap>>,
  // ) => ClassError0<TPluginsMap>
  // stack: (value: ErrorPluginStack<ErrorInstanceOfMap<TPluginsMap>>) => ClassError0<TPluginsMap>
  // cause: (value: ErrorPluginCause<ErrorInstanceOfMap<TPluginsMap>>) => ClassError0<TPluginsMap>
  use: {
    <TBuilder extends PluginError0>(
      plugin: TBuilder,
    ): ClassError0<ExtendErrorPluginsMap<TPluginsMap, PluginOfBuilder<TBuilder>>>
    <
      TKey extends string,
      TInputValue = undefined,
      TOutputValue = unknown,
      TResolveValue extends TOutputValue | undefined = TOutputValue | undefined,
    >(
      kind: 'prop',
      key: TKey,
      value: ErrorPluginPropOptions<TInputValue, TOutputValue, ErrorInstanceOfMap<TPluginsMap>, TResolveValue>,
    ): ClassError0<ExtendErrorPluginsMapWithProp<TPluginsMap, TKey, TInputValue, TOutputValue, TResolveValue>>
    <TKey extends string, TArgs extends unknown[], TOutputValue>(
      kind: 'method',
      key: TKey,
      value: ErrorPluginMethodFn<TOutputValue, TArgs, ErrorInstanceOfMap<TPluginsMap>>,
    ): ClassError0<ExtendErrorPluginsMapWithMethod<TPluginsMap, TKey, TArgs, TOutputValue>>
    (
      kind: 'adapt',
      value: ErrorPluginAdaptFn<ErrorInstanceOfMap<TPluginsMap>, ErrorResolvedProps<TPluginsMap>>,
    ): ClassError0<TPluginsMap>
    (kind: 'stack', value: ErrorPluginStack<ErrorInstanceOfMap<TPluginsMap>>): ClassError0<TPluginsMap>
    (kind: 'cause', value: ErrorPluginCause<ErrorInstanceOfMap<TPluginsMap>>): ClassError0<TPluginsMap>
    (kind: 'message', value: ErrorPluginMessage<ErrorInstanceOfMap<TPluginsMap>>): ClassError0<TPluginsMap>
  }
  plugin: () => PluginError0
} & ErrorStaticMethods<TPluginsMap>

export class Error0 extends Error {
  static readonly __pluginsMap?: EmptyPluginsMap
  readonly __pluginsMap?: EmptyPluginsMap
  protected static _plugins: ErrorPlugin[] = []

  private static readonly _emptyPlugin: ErrorPluginResolved = {
    props: {},
    methods: {},
    adapt: [],
    stack: undefined,
    cause: undefined,
    message: undefined,
  }

  private static _getResolvedPlugin(this: typeof Error0): ErrorPluginResolved {
    const resolved: ErrorPluginResolved = {
      props: {},
      methods: {},
      adapt: [],
    }
    for (const plugin of this._plugins) {
      if (plugin.props && 'stack' in plugin.props) {
        throw new Error(RESERVED_STACK_PROP_ERROR)
      }
      if (plugin.props && 'message' in plugin.props) {
        throw new Error(RESERVED_MESSAGE_PROP_ERROR)
      }
      Object.assign(resolved.props, plugin.props ?? this._emptyPlugin.props)
      Object.assign(resolved.methods, plugin.methods ?? this._emptyPlugin.methods)
      resolved.adapt.push(...(plugin.adapt ?? this._emptyPlugin.adapt))
      if (typeof plugin.stack !== 'undefined') {
        resolved.stack = plugin.stack
      }
      if (typeof plugin.cause !== 'undefined') {
        resolved.cause = plugin.cause
      }
      if (typeof plugin.message !== 'undefined') {
        resolved.message = plugin.message
      }
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
    const ownStore = Object.create(null) as ErrorOwnStore
    Object.defineProperty(this, OWN_SYMBOL, { value: ownStore, writable: true, enumerable: false, configurable: true })

    for (const [key, prop] of Object.entries(plugin.props)) {
      if (key === 'stack') {
        continue
      }
      Object.defineProperty(this, key, {
        get: () =>
          prop.resolve({
            own: ownStore[key],
            flow: this.flow(key as never),
            error: this,
          }),
        set: (value) => {
          ownStore[key] = value
        },
        enumerable: true,
        configurable: true,
      })
      if (key in input) {
        const ownValue = (input as Record<string, unknown>)[key]
        ownStore[key] = typeof prop.init === 'function' ? prop.init(ownValue) : ownValue
      }
    }
  }

  private static _getOwnStore(object: object): ErrorOwnStore | undefined {
    const record = object as Record<string | symbol, unknown>
    const existing = record[OWN_SYMBOL]
    if (existing && typeof existing === 'object') {
      return existing as ErrorOwnStore
    }
    return undefined
  }

  private static readonly isOwnProperty = (object: object, key: string): boolean => {
    const ownStore = this._getOwnStore(object)
    if (ownStore && Object.prototype.hasOwnProperty.call(ownStore, key)) {
      return true
    }
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
  private static _ownByKey(error: object, key: string): unknown {
    const ownStore = this._getOwnStore(error)
    if (ownStore && Object.prototype.hasOwnProperty.call(ownStore, key)) {
      return ownStore[key]
    }
    if (this.isOwnProperty(error, key)) {
      return (error as Record<string, unknown>)[key]
    }
    return undefined
  }
  private static _flowByKey(error: object, key: string): unknown[] {
    return this.causes(error, true).map((cause) => {
      return this._ownByKey(cause, key)
    })
  }

  static own<TThis extends typeof Error0>(this: TThis, error: unknown): ErrorOwnProps<PluginsMapOf<TThis>>
  static own<TThis extends typeof Error0, TKey extends keyof PluginsMapOf<TThis>['props'] & string>(
    this: TThis,
    error: unknown,
    key: TKey,
  ): ErrorOwnProps<PluginsMapOf<TThis>>[TKey]
  static own(error: unknown, key?: string): unknown {
    const error0 = this.from(error)
    if (key === undefined) {
      const ownValues: Record<string, unknown> = {}
      const plugin = this._getResolvedPlugin()
      for (const ownKey of Object.keys(plugin.props)) {
        ownValues[ownKey] = this._ownByKey(error0, ownKey)
      }
      return ownValues
    }
    return this._ownByKey(error0, key)
  }
  own<TThis extends Error0>(this: TThis): ErrorOwnProps<PluginsMapOfInstance<TThis>>
  own<TThis extends Error0, TKey extends keyof PluginsMapOfInstance<TThis>['props'] & string>(
    this: TThis,
    key: TKey,
  ): ErrorOwnProps<PluginsMapOfInstance<TThis>>[TKey]
  own(key?: string): unknown {
    const ctor = this.constructor as typeof Error0
    if (key === undefined) {
      return ctor.own(this)
    }
    return ctor._ownByKey(this, key)
  }

  static flow<TThis extends typeof Error0, TKey extends keyof PluginsMapOf<TThis>['props'] & string>(
    this: TThis,
    error: unknown,
    key: TKey,
  ): Array<ErrorOwnProps<PluginsMapOf<TThis>>[TKey]>
  static flow(error: unknown, key: string): unknown[] {
    const error0 = this.from(error)
    return this._flowByKey(error0, key)
  }
  flow<TThis extends Error0, TKey extends keyof PluginsMapOfInstance<TThis>['props'] & string>(
    this: TThis,
    key: TKey,
  ): Array<ErrorOwnProps<PluginsMapOfInstance<TThis>>[TKey]>
  flow(key: string): unknown[] {
    const ctor = this.constructor as typeof Error0
    return ctor._flowByKey(this, key)
  }

  static _resolveByKey(error: Error0, key: string, plugin: ErrorPluginResolved): unknown {
    try {
      // resolved[key] = (error0 as unknown as Record<string, unknown>)[key]
      const options = Object.defineProperties(
        {
          error,
        },
        {
          own: {
            get: () => error.own(key as never),
          },
          flow: {
            get: () => error.flow(key as never),
          },
        },
      )
      const resolver = plugin.props[key].resolve
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!resolver) {
        return (error as any)[key]
      }
      return plugin.props[key].resolve(options as ErrorPluginPropOptionsResolveOptions<any, any>)
    } catch {
      // eslint-disable-next-line no-console
      console.error(`Error0: failed to resolve property ${key}`, error)
      return undefined
    }
  }

  static resolve<TThis extends typeof Error0>(this: TThis, error: unknown): ErrorResolvedProps<PluginsMapOf<TThis>>
  static resolve(error: unknown): Record<string, unknown>
  static resolve(error: unknown): Record<string, unknown> {
    const error0 = this.from(error)
    const resolved: Record<string, unknown> = {}
    const plugin = this._getResolvedPlugin()
    for (const key of Object.keys(plugin.props)) {
      resolved[key] = this._resolveByKey(error0, key, plugin)
    }
    return resolved
  }
  resolve<TThis extends Error0>(this: TThis): ErrorResolvedProps<PluginsMapOfInstance<TThis>>
  resolve(): Record<string, unknown> {
    const ctor = this.constructor as typeof Error0
    return ctor.resolve(this)
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
  causes<TThis extends Error0>(this: TThis, instancesOnly?: false): [TThis, ...unknown[]]
  causes<TThis extends Error0>(this: TThis, instancesOnly: true): [TThis, ...TThis[]]
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

  static round(error: unknown, isPublic = false): Error0 {
    return this.from(this.serialize(error, isPublic))
  }

  private static _applyAdapt(error: Error0): Error0 {
    const plugin = this._getResolvedPlugin()
    for (const adapt of plugin.adapt) {
      const adapted = adapt(error as any)
      if (adapted && typeof adapted === 'object') {
        Object.assign(error as unknown as Record<string, unknown>, adapted)
      }
    }
    return error
  }

  private static _fromSerialized(error: unknown): Error0 {
    const message = this._extractMessage(error)
    if (typeof error !== 'object' || error === null) {
      return this._applyAdapt(new this(message, { cause: error }))
    }
    const errorRecord = error as Record<string, unknown>
    const recreated = new this(message)
    const plugin = this._getResolvedPlugin()
    const propsEntries = Object.entries(plugin.props)
    for (const [key, prop] of propsEntries) {
      if (prop.deserialize === false) {
        continue
      }
      if (!(key in errorRecord)) {
        continue
      }
      try {
        const value = prop.deserialize({ value: errorRecord[key], record: errorRecord })
        ;(recreated as unknown as Record<string, unknown>)[key] = value
      } catch {
        // eslint-disable-next-line no-console
        console.error(`Error0: failed to deserialize property ${key}`, errorRecord)
      }
    }
    // we do not serialize causes
    // ;(recreated as unknown as { cause?: unknown }).cause = errorRecord.cause
    if ('stack' in errorRecord) {
      try {
        if (typeof errorRecord.stack === 'string') {
          recreated.stack = errorRecord.stack
        }
      } catch {
        // eslint-disable-next-line no-console
        console.error('Error0: failed to deserialize stack', errorRecord)
      }
    }
    const causePlugin = plugin.cause
    if (causePlugin?.serialize && 'cause' in errorRecord) {
      try {
        if (this.isSerialized(errorRecord.cause)) {
          ;(recreated as { cause?: unknown }).cause = this._fromSerialized(errorRecord.cause)
        } else {
          ;(recreated as { cause?: unknown }).cause = errorRecord.cause
        }
      } catch {
        // eslint-disable-next-line no-console
        console.error('Error0: failed to deserialize cause', errorRecord)
      }
    }
    return recreated
  }

  private static _fromNonError0(error: unknown): Error0 {
    const message = this._extractMessage(error)
    return this._applyAdapt(new this(message, { cause: error }))
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
      adapt: [...(pluginRecord._plugin.adapt ?? [])],
      stack: pluginRecord._plugin.stack,
      cause: pluginRecord._plugin.cause,
      message: pluginRecord._plugin.message,
    }
  }

  // static prop<
  //   TThis extends typeof Error0,
  //   TKey extends string,
  //   TInputValue = undefined,
  //   TOutputValue = unknown,
  //   TResolveValue extends TOutputValue | undefined = TOutputValue | undefined,
  // >(
  //   this: TThis,
  //   key: TKey,
  //   value: ErrorPluginPropOptions<TInputValue, TOutputValue, ErrorInstanceOfMap<PluginsMapOf<TThis>>, TResolveValue>,
  // ): ClassError0<ExtendErrorPluginsMapWithProp<PluginsMapOf<TThis>, TKey, TInputValue, TOutputValue, TResolveValue>> {
  //   return this.use('prop', key, value)
  // }

  // static method<TThis extends typeof Error0, TKey extends string, TArgs extends unknown[], TOutputValue>(
  //   this: TThis,
  //   key: TKey,
  //   value: ErrorPluginMethodFn<TOutputValue, TArgs, ErrorInstanceOfMap<PluginsMapOf<TThis>>>,
  // ): ClassError0<ExtendErrorPluginsMapWithMethod<PluginsMapOf<TThis>, TKey, TArgs, TOutputValue>> {
  //   return this.use('method', key, value)
  // }

  // static adapt<TThis extends typeof Error0>(
  //   this: TThis,
  //   value: ErrorPluginAdaptFn<ErrorInstanceOfMap<PluginsMapOf<TThis>>, ErrorResolvedProps<PluginsMapOf<TThis>>>,
  // ): ClassError0<PluginsMapOf<TThis>> {
  //   return this.use('adapt', value)
  // }

  // static stack<TThis extends typeof Error0>(
  //   this: TThis,
  //   value: ErrorPluginStack<ErrorInstanceOfMap<PluginsMapOf<TThis>>>,
  // ): ClassError0<PluginsMapOf<TThis>> {
  //   return this.use('stack', value)
  // }

  // static cause<TThis extends typeof Error0>(
  //   this: TThis,
  //   value: ErrorPluginCause<ErrorInstanceOfMap<PluginsMapOf<TThis>>>,
  // ): ClassError0<PluginsMapOf<TThis>> {
  //   return this.use('cause', value)
  // }

  static use<TThis extends typeof Error0, TBuilder extends PluginError0>(
    this: TThis,
    plugin: TBuilder,
  ): ClassError0<ExtendErrorPluginsMap<PluginsMapOf<TThis>, PluginOfBuilder<TBuilder>>>
  static use<
    TThis extends typeof Error0,
    TKey extends string,
    TInputValue = undefined,
    TOutputValue = unknown,
    TResolveValue extends TOutputValue | undefined = TOutputValue | undefined,
  >(
    this: TThis,
    kind: 'prop',
    key: TKey,
    value: ErrorPluginPropOptions<TInputValue, TOutputValue, ErrorInstanceOfMap<PluginsMapOf<TThis>>, TResolveValue>,
  ): ClassError0<ExtendErrorPluginsMapWithProp<PluginsMapOf<TThis>, TKey, TInputValue, TOutputValue, TResolveValue>>
  static use<TThis extends typeof Error0, TKey extends string, TArgs extends unknown[], TOutputValue>(
    this: TThis,
    kind: 'method',
    key: TKey,
    value: ErrorPluginMethodFn<TOutputValue, TArgs, ErrorInstanceOfMap<PluginsMapOf<TThis>>>,
  ): ClassError0<ExtendErrorPluginsMapWithMethod<PluginsMapOf<TThis>, TKey, TArgs, TOutputValue>>
  static use<TThis extends typeof Error0>(
    this: TThis,
    kind: 'adapt',
    value: ErrorPluginAdaptFn<ErrorInstanceOfMap<PluginsMapOf<TThis>>, ErrorResolvedProps<PluginsMapOf<TThis>>>,
  ): ClassError0<PluginsMapOf<TThis>>
  static use<TThis extends typeof Error0>(
    this: TThis,
    kind: 'stack',
    value: ErrorPluginStack<ErrorInstanceOfMap<PluginsMapOf<TThis>>>,
  ): ClassError0<PluginsMapOf<TThis>>
  static use<TThis extends typeof Error0>(
    this: TThis,
    kind: 'cause',
    value: ErrorPluginCause<ErrorInstanceOfMap<PluginsMapOf<TThis>>>,
  ): ClassError0<PluginsMapOf<TThis>>
  static use<TThis extends typeof Error0>(
    this: TThis,
    kind: 'message',
    value: ErrorPluginMessage<ErrorInstanceOfMap<PluginsMapOf<TThis>>>,
  ): ClassError0<PluginsMapOf<TThis>>
  static use(
    this: typeof Error0,
    first: PluginError0 | 'prop' | 'method' | 'adapt' | 'stack' | 'cause' | 'message',
    key?: unknown,
    value?: ErrorPluginPropOptions<unknown> | ErrorPluginMethodFn<unknown>,
  ): ClassError0 {
    if (first instanceof PluginError0) {
      return this._useWithPlugin(this._pluginFromBuilder(first))
    }
    if (first === 'stack') {
      if (typeof key === 'undefined') {
        throw new Error('Error0.use("stack", value) requires stack plugin value')
      }
      if (typeof key !== 'object' || key === null || typeof (key as { serialize?: unknown }).serialize !== 'function') {
        throw new Error('Error0.use("stack", value) expects { serialize: function }')
      }
      return this._useWithPlugin({
        stack: key as ErrorPluginStack,
      })
    }
    if (first === 'cause') {
      if (typeof key === 'undefined') {
        throw new Error('Error0.use("cause", value) requires cause plugin value')
      }
      if (typeof key !== 'object' || key === null || typeof (key as { serialize?: unknown }).serialize !== 'function') {
        throw new Error('Error0.use("cause", value) expects { serialize: function }')
      }
      return this._useWithPlugin({
        cause: key as ErrorPluginCause,
      })
    }
    if (first === 'message') {
      if (typeof key === 'undefined') {
        throw new Error('Error0.use("message", value) requires message plugin value')
      }
      if (typeof key !== 'object' || key === null || typeof (key as { serialize?: unknown }).serialize !== 'function') {
        throw new Error('Error0.use("message", value) expects { serialize: function }')
      }
      return this._useWithPlugin({
        message: key as ErrorPluginMessage,
      })
    }
    if (first === 'adapt') {
      if (typeof key !== 'function') {
        throw new Error('Error0.use("adapt", value) requires adapt function')
      }
      return this._useWithPlugin({
        adapt: [key as ErrorPluginAdaptFn<Error0, Record<string, unknown>>],
      })
    }
    if (typeof key !== 'string' || value === undefined) {
      throw new Error('Error0.use(kind, key, value) requires key and value')
    }

    if (first === 'prop') {
      if (key === 'stack') {
        throw new Error(RESERVED_STACK_PROP_ERROR)
      }
      if (key === 'message') {
        throw new Error(RESERVED_MESSAGE_PROP_ERROR)
      }
      return this._useWithPlugin({
        props: { [key]: value as ErrorPluginPropOptions<unknown> },
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
    const plugin = this._getResolvedPlugin()
    const messagePlugin = plugin.message
    let serializedMessage: unknown = error0.message
    try {
      if (messagePlugin) {
        serializedMessage = messagePlugin.serialize({ value: error0.message, error: error0, isPublic })
      }
    } catch {
      // eslint-disable-next-line no-console
      console.error('Error0: failed to serialize message', error0)
      serializedMessage = error0.message
    }
    const json: Record<string, unknown> = {
      name: error0.name,
      message: serializedMessage,
      // we do not serialize causes, it is enough that we have floated props and adapt helper
      // cause: error0.cause,
    }

    const propsEntries = Object.entries(plugin.props)
    for (const [key, prop] of propsEntries) {
      if (prop.serialize === false) {
        continue
      }
      try {
        const options = Object.defineProperties(
          {
            error: error0,
            isPublic,
          },
          {
            own: {
              get: () => error0.own(key as never),
            },
            flow: {
              get: () => error0.flow(key as never),
            },
            resolved: {
              get: () => this._resolveByKey(error0, key, plugin),
            },
          },
        )
        const jsonValue = prop.serialize(options as ErrorPluginPropSerializeOptions<any, any, any>)
        if (jsonValue !== undefined) {
          json[key] = jsonValue
        }
      } catch {
        // eslint-disable-next-line no-console
        console.error(`Error0: failed to serialize property ${key}`, error0)
      }
    }
    const stackPlugin = plugin.stack
    try {
      let serializedStack: unknown
      if (stackPlugin) {
        serializedStack = stackPlugin.serialize({ value: error0.stack, error: error0, isPublic })
      } else {
        serializedStack = error0.stack
      }
      if (serializedStack !== undefined) {
        json.stack = serializedStack
      }
    } catch {
      // eslint-disable-next-line no-console
      console.error('Error0: failed to serialize stack', error0)
    }
    const causePlugin = plugin.cause
    if (causePlugin?.serialize) {
      try {
        const serializedCause = causePlugin.serialize({
          value: (error0 as { cause?: unknown }).cause,
          error: error0,
          isPublic,
        })
        if (serializedCause !== undefined) {
          json.cause = serializedCause
        }
      } catch {
        // eslint-disable-next-line no-console
        console.error('Error0: failed to serialize cause', error0)
      }
    }
    return Object.fromEntries(Object.entries(json).filter(([, value]) => value !== undefined)) as Record<
      string,
      unknown
    >
  }

  serialize(isPublic = true): Record<string, unknown> {
    const ctor = this.constructor as typeof Error0
    return ctor.serialize(this, isPublic)
  }

  round<TThis extends Error0>(this: TThis, isPublic = true): TThis {
    const ctor = this.constructor as typeof Error0
    return ctor.round(this, isPublic) as TThis
  }
}
