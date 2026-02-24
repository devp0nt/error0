export type ErrorExtension<TKey extends string, TInputValue, TOutputValue> = {
  key: TKey
  setter: (value: TInputValue) => TOutputValue
  getter: (error: Error0, flow: unknown[]) => TOutputValue
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
export type ErrorInput<TExtensionsMap extends ErrorExtensionsMap> =
  IsEmptyObject<TExtensionsMap> extends true
    ? { [key: string]: never }
    : Partial<{
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

type ErrorClass<TExtensionsMap extends ErrorExtensionsMap = EmptyExtensionsMap> = {
  new (message: string, input?: ErrorInput<TExtensionsMap>): Error0 & ErrorOutput<TExtensionsMap>
  new (input: { message: string } & ErrorInput<TExtensionsMap>): Error0 & ErrorOutput<TExtensionsMap>
  readonly __extensionsMap?: TExtensionsMap
  extend: {
    <TKey extends string, TInputValue, TOutputValue>(
      extension: ErrorExtension<TKey, TInputValue, TOutputValue>,
    ): ErrorClass<TExtensionsMap & Record<TKey, { input: TInputValue; output: TOutputValue }>>
    <TKey extends string, TInputValue, TOutputValue>(
      key: TKey,
      setter: (value: TInputValue) => TOutputValue,
      getter: (error: Error0 & Partial<ErrorOutput<TExtensionsMap>>, flow: unknown[]) => TOutputValue,
    ): ErrorClass<TExtensionsMap & Record<TKey, { input: TInputValue; output: TOutputValue }>>
  }
  extension: <T extends ErrorExtension<string, unknown, unknown>>(extension: T) => T
}

export class Error0 extends Error {
  static readonly __extensionsMap?: EmptyExtensionsMap
  protected static _extensions: Array<ErrorExtension<string, unknown, unknown>> = []

  get _own(): Record<string, unknown> {
    return { x: 1 }
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

    super(input.message)
    this.name = 'Error0'

    const ctor = this.constructor as typeof Error0
    for (const extension of ctor._extensions) {
      const rawValue = (input as Record<string, unknown>)[extension.key]
      const value =
        rawValue !== undefined ? extension.setter(rawValue) : extension.getter(this, ctor.flow(this, extension.key))
      ;(this as Record<string, unknown>)[extension.key] = value
    }
  }

  static flow(error: Error, key: string): unknown[] {
    const values: unknown[] = []
    let current: unknown = error
    const maxDepth = 50

    for (let depth = 0; depth < maxDepth; depth += 1) {
      if (!(current instanceof Error)) {
        break
      }
      const currentRecord = current as unknown as Record<string, unknown>
      if (key in currentRecord) {
        const value = currentRecord[key]
        if (value !== undefined) {
          values.push(value)
        }
      }
      current = (current as { cause?: unknown }).cause
    }

    return values
  }

  static extend<TThis extends typeof Error0, TKey extends string, TInputValue, TOutputValue>(
    this: TThis,
    extension: ErrorExtension<TKey, TInputValue, TOutputValue>,
  ): ErrorClass<ExtensionsMapOf<TThis> & Record<TKey, { input: TInputValue; output: TOutputValue }>>
  static extend<TThis extends typeof Error0, TKey extends string, TInputValue, TOutputValue>(
    this: TThis,
    key: TKey,
    setter: (value: TInputValue) => TOutputValue,
    getter: (error: Error0, flow: unknown[]) => TOutputValue,
  ): ErrorClass<ExtensionsMapOf<TThis> & Record<TKey, { input: TInputValue; output: TOutputValue }>>
  static extend(this: typeof Error0, ...args: unknown[]): any {
    const [extensionOrKey, setter, getter] = args as [
      ErrorExtension<string, unknown, unknown> | string,
      ((value: unknown) => unknown) | undefined,
      ((error: Error0, flow: unknown[]) => unknown) | undefined,
    ]
    const extension =
      typeof extensionOrKey === 'string'
        ? ({
            key: extensionOrKey,
            setter: setter as (value: unknown) => unknown,
            getter: getter as (error: Error0, flow: unknown[]) => unknown,
          } as ErrorExtension<string, unknown, unknown>)
        : extensionOrKey

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
