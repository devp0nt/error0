export class Error0 extends Error {
  constructor(message: string, meta?: ErrorInput<TPluginsMap>)
  constructor(input: { message: string } & ErrorInput<TPluginsMap>)
  constructor(
    ...args: [message: string, meta?: ErrorInput<TPluginsMap>] | [{ message: string } & ErrorInput<TPluginsMap>]
  ) {
    const [message, meta] = args
    if (typeof message === 'string') {
      super(message)
    } else {
      super(message.message)
    }
    this.name = 'Error0'
    this.meta = (meta ?? {}) as TMeta
    for (const [key, value] of Object.entries(this.meta)) {
      ;(this as any)[key] = value
    }
    delete this.meta
  }

  static flow(error: Error0, key: string) {
    // here we get array of props where each is unkown, and no one is undefined, get if rom current error and its causes
  }

  static use<TPlugin extends ErrorPlugin<string, unknown>>(plugin: TPlugin)
  static use<TKey extends string, TInputValue, TOutputValue>(
    key: TKey,
    getter: (error: Error0, flow: unknown[]) => TOutputValue,
    setter: (value: TInputValue) => TOutputValue,
  )
  static use(...args: [key: string, getter: (values: unknown[]) => unknown] | [plugin: ErrorPlugin<string, unknown>]) {
    // it shuld return another class extended from Error0, it should respect previously applied plugins
    // also we should respect that type X = NewError0 exetnds PrevError0 ? true : false (is true)
    // I think we need eval here, so do not store _data or meta in toplevel if error, but just have first citizen props getted from plugin
  }

  static plugin<T extends ErrorPlugin<string, unknown>>(plugin: T) {
    return plugin
  }
}

export type ErrorPlugin<TKey extends string, TOutputValue, TInputValue = TOutputValue> = {
  key: TKey
  getter: (error: Error0, flow: unknown[]) => TOutputValue
  setter: (value: TInputValue) => TOutputValue
}
export type ErrorPluginsMap = Record<string, { input: unknown; output: unknown }>
export type ExtendErrorPluginsMap<TMap extends ErrorPluginsMap, TPlugin extends ErrorPlugin<string, unknown>> = TMap &
  (TPlugin extends ErrorPlugin<infer TKey, infer TOutputValue, infer TInputValue>
    ? Record<TKey, { input: TInputValue; output: TOutputValue }>
    : unknown)
export type ErrorInput<TPluginsMap extends ErrorPluginsMap> = Partial<{
  [TKey in keyof TPluginsMap]: TPluginsMap[TKey]['input']
}>

// example
// const plugin = Error0.plugin({
//   key: 'status',
//   getter: (values) => {
//     const number = Number(values[0].status)
//     if (isNaN(number)) {
//       return undefined
//     }
//     return number
//   },
// }

// const AppError = (Error0.use(plugin)
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
