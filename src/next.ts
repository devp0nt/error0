type ErrorPropResolveOptions<TValue, TError extends NextError0 = NextError0> = {
  own: TValue | undefined
  flow: Array<TValue | undefined>
  error: TError
}

type ErrorPropSerializeOptions<TValue, TResolved, TError extends NextError0 = NextError0> = {
  own: TValue | undefined
  flow: Array<TValue | undefined>
  resolved: TResolved
  error: TError
  isPublic: boolean
}

type ErrorPropDeserializeOptions = {
  value: unknown
  record: Record<string, unknown>
}

export type ErrorPropOptions<
  TValue = unknown,
  TResolved = TValue | undefined,
  TError extends NextError0 = NextError0,
> = {
  resolve: (options: ErrorPropResolveOptions<TValue, TError>) => TResolved
  serialize?: ((options: ErrorPropSerializeOptions<TValue, TResolved, TError>) => unknown) | false
  deserialize?: ((options: ErrorPropDeserializeOptions) => TValue | undefined) | false
}

type ErrorPropMap = Record<string, ErrorPropOptions<unknown, unknown>>
type NextError0Input = { cause?: unknown; [key: string]: unknown }

const PROP_DEFS_SYMBOL: unique symbol = Symbol('NextError0.propDefs')
const OWN_STORE_SYMBOL: unique symbol = Symbol('NextError0.ownStore')

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const hasOwn = (value: object, key: string | symbol): boolean => Object.prototype.hasOwnProperty.call(value, key)

const getPropDefs = (ctor: typeof NextError0): ErrorPropMap => {
  const record = ctor as unknown as Record<string | symbol, unknown>
  const existing = record[PROP_DEFS_SYMBOL]
  if (isRecord(existing)) {
    return existing as ErrorPropMap
  }

  const parent = Object.getPrototypeOf(ctor)
  const inherited =
    typeof parent === 'function' && (parent === NextError0 || parent.prototype instanceof NextError0)
      ? (parent as typeof NextError0)._getPropDefs()
      : {}
  const ownDefs = { ...inherited }
  Object.defineProperty(ctor, PROP_DEFS_SYMBOL, {
    value: ownDefs,
    writable: true,
    enumerable: false,
    configurable: true,
  })
  return ownDefs
}

const getOwnStore = (error: NextError0): Record<string, unknown> => {
  return (error as unknown as Record<string | symbol, unknown>)[OWN_STORE_SYMBOL] as Record<string, unknown>
}

const extractMessage = (value: unknown): string => {
  if (typeof value === 'string') {
    return value
  }
  if (isRecord(value) && typeof value.message === 'string') {
    return value.message
  }
  return 'Unknown error'
}

const extractCause = (value: unknown): unknown => {
  if (isRecord(value) && 'cause' in value) {
    return value.cause
  }
  return undefined
}

export function ErrorProp<TValue = unknown, TResolved = TValue | undefined>(
  options: ErrorPropOptions<TValue, TResolved>,
): (target: object, propertyKey: string | symbol) => void {
  return (target: object, propertyKey: string | symbol): void => {
    if (typeof propertyKey !== 'string') {
      throw new Error('ErrorProp can only decorate string keys')
    }
    const ctor = (target as { constructor?: unknown }).constructor
    if (typeof ctor !== 'function' || !(ctor === NextError0 || ctor.prototype instanceof NextError0)) {
      throw new Error('ErrorProp can only be used on classes extending NextError0')
    }
    const defs = getPropDefs(ctor as typeof NextError0)
    defs[propertyKey] = options as ErrorPropOptions<unknown, unknown>
  }
}

export class NextError0 extends Error {
  static MAX_CAUSES_DEPTH = 99

  constructor(message: string, input?: NextError0Input)
  constructor(input: { message: string } & NextError0Input)
  constructor(...args: [message: string, input?: NextError0Input] | [{ message: string } & NextError0Input]) {
    const [first, second] = args
    const input = typeof first === 'string' ? { message: first, ...(second ?? {}) } : first
    super(input.message, { cause: input.cause })
    this.name = 'NextError0'
    Object.defineProperty(this, OWN_STORE_SYMBOL, {
      value: Object.create(null) as Record<string, unknown>,
      writable: true,
      enumerable: false,
      configurable: true,
    })

    const defs = (this.constructor as typeof NextError0)._getPropDefs()
    const ownStore = getOwnStore(this)
    for (const key of Object.keys(defs)) {
      if (key in input) {
        ownStore[key] = input[key]
      }
    }
    this._applyResolvedProps()
  }

  static _getPropDefs(this: typeof NextError0): ErrorPropMap {
    return getPropDefs(this)
  }

  static is(error: unknown): error is NextError0 {
    return error instanceof this
  }

  static isSerialized(error: unknown): error is Record<string, unknown> {
    return isRecord(error) && error.name === 'NextError0'
  }

  static causes(error: unknown, instancesOnly?: false): unknown[]
  static causes<T extends typeof NextError0>(this: T, error: unknown, instancesOnly: true): Array<InstanceType<T>>
  static causes(error: unknown, instancesOnly?: boolean): unknown[] {
    const list: unknown[] = []
    const seen = new Set<unknown>()
    let current: unknown = error
    let depth = 0
    while (depth < this.MAX_CAUSES_DEPTH) {
      if (seen.has(current)) {
        break
      }
      seen.add(current)
      if (!instancesOnly || this.is(current)) {
        list.push(current)
      }
      current = extractCause(current)
      if (typeof current === 'undefined') {
        break
      }
      depth += 1
    }
    return list
  }

  causes(instancesOnly?: false): unknown[]
  causes<T extends NextError0>(this: T, instancesOnly: true): T[]
  causes(instancesOnly?: boolean): unknown[] {
    const ctor = this.constructor as typeof NextError0
    if (instancesOnly) {
      return ctor.causes(this, true)
    }
    return ctor.causes(this)
  }

  static own(error: unknown, key?: string): unknown {
    const current = this.from(error)
    const ownStore = getOwnStore(current)
    if (typeof key === 'undefined') {
      const output: Record<string, unknown> = {}
      for (const propKey of Object.keys(this._getPropDefs())) {
        output[propKey] = ownStore[propKey]
      }
      return output
    }
    return ownStore[key]
  }

  own(key?: string): unknown {
    const ctor = this.constructor as typeof NextError0
    return ctor.own(this, key)
  }

  static flow(error: unknown, key: string): unknown[] {
    const list = this.causes(error, true)
    const output = new Array<unknown>(list.length)
    for (let i = 0; i < list.length; i += 1) {
      output[i] = this.own(list[i], key)
    }
    return output
  }

  flow(key: string): unknown[] {
    const ctor = this.constructor as typeof NextError0
    return ctor.flow(this, key)
  }

  static resolve(error: unknown): Record<string, unknown> {
    const current = this.from(error)
    const output: Record<string, unknown> = {}
    const defs = this._getPropDefs()
    for (const [key, def] of Object.entries(defs)) {
      output[key] = def.resolve({
        own: this.own(current, key),
        flow: this.flow(current, key),
        error: current,
      })
    }
    return output
  }

  resolve(): Record<string, unknown> {
    const ctor = this.constructor as typeof NextError0
    return ctor.resolve(this)
  }

  private _applyResolvedProps(): void {
    const ctor = this.constructor as typeof NextError0
    const defs = ctor._getPropDefs()
    for (const [key, def] of Object.entries(defs)) {
      Object.defineProperty(this, key, {
        value: def.resolve({
          own: ctor.own(this, key),
          flow: ctor.flow(this, key),
          error: this,
        }),
        writable: true,
        enumerable: true,
        configurable: true,
      })
    }
  }

  static serialize(error: unknown, isPublic = true): Record<string, unknown> {
    const current = this.from(error)
    const defs = this._getPropDefs()
    const json: Record<string, unknown> = {
      name: current.name,
      message: current.message,
    }

    for (const [key, def] of Object.entries(defs)) {
      if (def.serialize === false) {
        continue
      }
      const own = this.own(current, key)
      const flow = this.flow(current, key)
      const resolved = def.resolve({
        own,
        flow,
        error: current,
      })
      const serializedValue =
        typeof def.serialize === 'function'
          ? def.serialize({
              own,
              flow,
              resolved,
              error: current,
              isPublic,
            })
          : resolved
      if (typeof serializedValue !== 'undefined') {
        json[key] = serializedValue
      }
    }

    const cause = extractCause(current)
    if (cause instanceof NextError0) {
      json.cause = cause.serialize(isPublic)
    }

    return json
  }

  serialize(isPublic = true): Record<string, unknown> {
    const ctor = this.constructor as typeof NextError0
    return ctor.serialize(this, isPublic)
  }

  static from<T extends typeof NextError0>(this: T, error: unknown): InstanceType<T> {
    if (this.is(error)) {
      return error as InstanceType<T>
    }

    if (this.isSerialized(error)) {
      const input: Record<string, unknown> = { message: extractMessage(error) }
      const defs = this._getPropDefs()
      for (const [key, def] of Object.entries(defs)) {
        if (!hasOwn(error, key) || def.deserialize === false) {
          continue
        }
        input[key] =
          typeof def.deserialize === 'function' ? def.deserialize({ value: error[key], record: error }) : error[key]
      }
      if (hasOwn(error, 'cause')) {
        input.cause = error.cause
      }
      const recreated = new this(input as { message: string } & NextError0Input)
      if (recreated.cause && this.isSerialized(recreated.cause)) {
        ;(recreated as { cause?: unknown }).cause = this.from(recreated.cause)
      }
      ;(recreated as unknown as { _applyResolvedProps: () => void })._applyResolvedProps()
      return recreated as InstanceType<T>
    }

    return new this({ message: extractMessage(error), cause: error } as {
      message: string
    } & NextError0Input) as InstanceType<T>
  }
}
