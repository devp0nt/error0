import { Meta0 } from '@devp0nt/meta0'
import { meta0PluginTag } from '@devp0nt/meta0/plugins/meta0-plugin-tag'
import { type AxiosError, HttpStatusCode, isAxiosError } from 'axios'
import get from 'lodash/get.js'
import { ZodError } from 'zod'

// TODO: just status, not http status
// TODO: .getMessage, .getClientMessage, .getDescription
// TODO: clientDescription
// TODO: Эррор 0 можно передать и вторым аргументом в логгер, тогда её месадж попадёт в мету, а первый месадж в сам месадж логера
// TODO: Зод, аксиос, это всё плагины
// TODO: В эррор0 добавить ориджинал
// TODO: store tags as array from all causes
// TODO: not use self stack if toError0
// TODO: fix default message in extended error0, should be used in constuctor of Error0
// TODO: remove defaults prop from getPropsFromUnknown
// TODO: code has enum type, fn to check if code exists

const isFilled = <T>(value: T): value is NonNullable<T> => value !== null && value !== undefined && value !== ''
const toStringOrUndefined = (value: unknown): string | undefined => {
  return typeof value === 'string' ? value : undefined
}
const toNumberOrUndefined = (value: unknown): number | undefined => {
  if (typeof value === 'number') {
    return value
  }
  const number = Number(value)
  if (typeof value === 'string' && !Number.isNaN(number)) {
    return number
  }
  return undefined
}
const toBooleanOrUndefined = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') {
    return value
  }
  return undefined
}

export class Error0 extends Error {
  public readonly __I_AM_ERROR_0 = true as const

  public readonly tag?: Error0.GeneralProps['tag']
  public readonly code?: Error0.GeneralProps['code']
  public readonly httpStatus?: Error0.GeneralProps['httpStatus']
  public readonly expected?: Error0.GeneralProps['expected']
  public readonly clientMessage?: Error0.GeneralProps['clientMessage']
  public readonly anyMessage?: Error0.GeneralProps['anyMessage']
  public override readonly cause?: Error0.GeneralProps['cause']
  public readonly meta?: Meta0.ValueTypeNullish
  public readonly zodError?: Error0.GeneralProps['zodError']
  public readonly axiosError?: Error0.GeneralProps['axiosError']

  static defaultMessage = 'Unknown error'
  static defaultCode?: Error0.GeneralProps['code']
  static defaultHttpStatus?: Error0.GeneralProps['httpStatus']
  static defaultExpected?: Error0.GeneralProps['expected']
  static defaultClientMessage?: Error0.GeneralProps['clientMessage']
  static defaultMeta?: Meta0.Meta0OrValueTypeNullish

  public readonly propsOriginal: Error0.GeneralProps

  constructor(message: string)
  constructor(input: Error0.Input)
  constructor(message: string, input: Error0.Input)
  constructor(error: Error)
  constructor(error: Error, input: Error0.Input)
  constructor(value: unknown)
  constructor(value: unknown, input: Error0.Input)
  constructor(...args: unknown[]) {
    const input: Partial<Error0.Input> = {}
    if (args[0] instanceof Error) {
      input.cause = args[0]
    } else if (typeof args[0] === 'object' && args[0] !== null) {
      Object.assign(input, args[0])
    } else if (typeof args[0] === 'string') {
      input.message = args[0]
    }
    if (typeof args[1] === 'object' && args[1] !== null) {
      Object.assign(input, args[1])
    }
    const safeInput = Error0._safeParseInput(input)

    const message = safeInput.message || Error0.defaultMessage
    super(message)
    Object.setPrototypeOf(this, (this.constructor as typeof Error0).prototype)
    this.name = 'Error0'

    this.propsOriginal = (this.constructor as typeof Error0)._getSelfGeneralProps({
      error0Input: safeInput,
      message,
      stack: safeInput.stack || this.stack,
    })
    const causesProps = (this.constructor as typeof Error0)._getCausesPropsFromError0Props(
      this.propsOriginal,
      (this.constructor as typeof Error0).defaultMaxLevel,
    )
    const propsFloated = (this.constructor as typeof Error0)._getSelfPropsFloated(causesProps)
    this.tag = propsFloated.tag
    this.code = propsFloated.code
    this.httpStatus = propsFloated.httpStatus
    this.expected = propsFloated.expected
    this.clientMessage = propsFloated.clientMessage
    this.cause = propsFloated.cause
    this.stack = propsFloated.stack
    this.meta = propsFloated.meta
    this.zodError = propsFloated.zodError
    this.axiosError = propsFloated.axiosError
  }

  // settings

  static defaultMaxLevel = 10

  // props

  public static _safeParseInput(error0Input: Record<string, unknown>): Error0.Input {
    const result: Error0.Input = {}
    result.message = typeof error0Input.message === 'string' ? error0Input.message : undefined
    result.tag = typeof error0Input.tag === 'string' ? error0Input.tag : undefined
    result.code = typeof error0Input.code === 'string' ? error0Input.code : undefined
    result.httpStatus =
      typeof error0Input.httpStatus === 'number' || typeof error0Input.httpStatus === 'string'
        ? (error0Input.httpStatus as never)
        : undefined
    result.expected =
      typeof error0Input.expected === 'function' || typeof error0Input.expected === 'boolean'
        ? (error0Input.expected as never)
        : undefined
    result.clientMessage = typeof error0Input.clientMessage === 'string' ? error0Input.clientMessage : undefined
    result.cause = error0Input.cause
    result.stack = typeof error0Input.stack === 'string' ? error0Input.stack : undefined
    // result.meta0 =
    //   error0Input.meta0 instanceof Meta0 ? error0Input.meta0 : undefined
    // result.meta =
    //   typeof error0Input.meta === "object" && error0Input.meta !== null
    //     ? error0Input.meta
    //     : undefined
    result.meta =
      error0Input.meta instanceof Meta0
        ? error0Input.meta
        : typeof error0Input.meta === 'object' && error0Input.meta !== null
          ? (error0Input.meta as Meta0.ValueType)
          : undefined
    result.zodError = error0Input.zodError instanceof ZodError ? error0Input.zodError : undefined
    result.axiosError = isAxiosError(error0Input.axiosError) ? error0Input.axiosError : undefined
    return result
  }

  public static _getSelfGeneralProps({
    error0Input,
    message,
    stack,
  }: {
    error0Input: Error0.Input
    message: string
    stack: Error0.GeneralProps['stack']
  }): Error0.GeneralProps {
    // const meta = Meta0.merge(error0Input.meta0, error0Input.meta).value

    // const meta0 = Meta0.extend(error0Input.meta, this.defaultMeta)
    // const defaultMetaValue =
    //   this.defaultMeta && typeof this.defaultMeta === 'object' && 'getValue' in this.defaultMeta
    //     ? (this.defaultMeta as any).getValue()
    //     : this.defaultMeta

    const meta0 = Meta0.extend(this.defaultMeta, error0Input.meta)
    const meta = meta0.getValue()
    const finalTag = meta0PluginTag.public.getFullTag(meta0, error0Input.tag)
    delete meta.tagPrefix
    const clientMessage = error0Input.clientMessage || this.defaultClientMessage
    const result: Error0.GeneralProps = {
      message: error0Input.message || this.defaultMessage,
      tag: finalTag,
      code: error0Input.code || toStringOrUndefined(meta.code) || this.defaultCode,
      httpStatus:
        typeof error0Input.httpStatus === 'number'
          ? error0Input.httpStatus
          : error0Input.httpStatus &&
              typeof error0Input.httpStatus === 'string' &&
              error0Input.httpStatus in HttpStatusCode
            ? HttpStatusCode[error0Input.httpStatus]
            : toNumberOrUndefined(meta.httpStatus) || this.defaultHttpStatus,
      expected: undefined,
      clientMessage,
      anyMessage: clientMessage || message,
      cause: error0Input.cause,
      stack: undefined,
      meta,
      zodError: error0Input.zodError,
      axiosError: error0Input.axiosError,
    }
    result.expected = this._normalizeSelfExpected(
      result,
      typeof error0Input.expected === 'boolean' || typeof error0Input.expected === 'function'
        ? error0Input.expected
        : toBooleanOrUndefined(meta.expected) || this.defaultExpected,
    )
    result.stack = this._removeConstructorStackPart(stack)
    return result
  }

  public static _getSelfPropsFloated(causesProps: Error0.GeneralProps[]): Error0.GeneralProps {
    const cause = this._getClosestPropValue(causesProps, 'cause')
    const stack = this._mergeStack(causesProps[1]?.stack, causesProps[0]?.stack)
    const closestTag = this._getClosestPropValue(causesProps, 'tag')
    const meta = this._getMergedMetaValue(causesProps)
    const tag = meta0PluginTag.public.getFullTag(meta, closestTag)
    const propsFloated: Error0.GeneralProps = {
      message: this._getClosestPropValue(causesProps, 'message'),
      tag,
      code: this._getClosestPropValue(causesProps, 'code'),
      httpStatus: this._getClosestPropValue(causesProps, 'httpStatus'),
      expected: this._isExpected(causesProps),
      clientMessage: this._getClosestPropValue(causesProps, 'clientMessage'),
      cause,
      stack,
      anyMessage: causesProps[0].anyMessage,
      meta,
      zodError: this._getClosestPropValue(causesProps, 'zodError'),
      axiosError: this._getClosestPropValue(causesProps, 'axiosError'),
    }
    return propsFloated
  }

  // sepcial

  public static _getExtraError0PropsByZodError(zodError: ZodError): Partial<Error0.GeneralProps> {
    return {
      message: `Zod Validation Error: ${zodError.message}`,
    }
  }

  public static _getExtraError0PropsByAxiosError(axiosError: AxiosError): Partial<Error0.GeneralProps> {
    return {
      message: 'Axios Error',
      meta: {
        axiosData: (() => {
          try {
            return JSON.stringify(axiosError.response?.data)
          } catch {
            return undefined
          }
        })(),
        axiosStatus: axiosError.response?.status,
      },
    }
  }

  public static _assignError0Props(
    error0Props: Error0.GeneralProps,
    extraError0Props: Partial<Error0.GeneralProps>,
  ): void {
    const metaValue = Meta0.mergeValues(error0Props.meta, extraError0Props.meta)
    Object.assign(error0Props, extraError0Props, { meta: metaValue })
  }

  // expected

  public static _normalizeSelfExpected(
    error0Props: Error0.GeneralProps,
    expectedProvided: Error0.Input['expected'],
  ): boolean | undefined {
    if (typeof expectedProvided === 'function') {
      return expectedProvided(error0Props)
    }
    return expectedProvided
  }

  public static _isExpected(causesProps: Error0.GeneralProps[]): boolean {
    let hasExpectedTrue = false
    for (const causeProps of causesProps) {
      if (causeProps.expected === false) {
        return false
      }
      if (causeProps.expected === true) {
        hasExpectedTrue = true
      }
    }
    return hasExpectedTrue
  }

  // getters

  public static _getPropsFromUnknown(error: unknown, defaults?: Error0.Input): Error0.GeneralProps {
    if (typeof error !== 'object' || error === null) {
      return {
        message: undefined,
        tag: undefined,
        code: undefined,
        httpStatus: undefined,
        expected: undefined,
        clientMessage: undefined,
        anyMessage: this.defaultMessage,
        cause: undefined,
        stack: undefined,
        zodError: undefined,
        axiosError: undefined,
        meta: {},
      }
    }
    const message = 'message' in error && typeof error.message === 'string' ? error.message : undefined
    const clientMessage =
      'clientMessage' in error && typeof error.clientMessage === 'string'
        ? error.clientMessage
        : defaults?.clientMessage || undefined
    const result: Error0.GeneralProps = {
      message,
      code: 'code' in error && typeof error.code === 'string' ? error.code : defaults?.code || undefined,
      clientMessage,
      anyMessage: clientMessage || message || this.defaultMessage,
      expected: undefined,
      stack: 'stack' in error && typeof error.stack === 'string' ? error.stack : undefined,
      tag: 'tag' in error && typeof error.tag === 'string' ? error.tag : defaults?.tag || undefined,
      cause: 'cause' in error ? error.cause : defaults?.cause || undefined,
      meta:
        'meta' in error && typeof error.meta === 'object' && error.meta !== null
          ? Meta0.getValue(error.meta as Meta0.ValueType)
          : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            Meta0.getValue(defaults?.meta) || {},
      httpStatus:
        'httpStatus' in error && typeof error.httpStatus === 'number' && error.httpStatus in HttpStatusCode
          ? error.httpStatus
          : typeof defaults?.httpStatus === 'string'
            ? HttpStatusCode[defaults.httpStatus]
            : defaults?.httpStatus,
      zodError:
        'zodError' in error && error.zodError instanceof ZodError
          ? error.zodError
          : error instanceof ZodError
            ? error
            : defaults?.zodError,
      axiosError:
        'axiosError' in error && isAxiosError(error.axiosError)
          ? error.axiosError
          : isAxiosError(error)
            ? error
            : defaults?.axiosError,
    }
    result.expected = this._normalizeSelfExpected(
      result,
      'expected' in error && (typeof error.expected === 'boolean' || typeof error.expected === 'function')
        ? (error.expected as Error0.ExpectedFn)
        : defaults?.expected || undefined,
    )
    if (result.zodError) {
      this._assignError0Props(result, this._getExtraError0PropsByZodError(result.zodError))
    }
    if (result.axiosError) {
      this._assignError0Props(result, this._getExtraError0PropsByAxiosError(result.axiosError))
    }
    return result
  }

  public static _getCausesPropsFromUnknown(error: unknown, maxLevel: number): Error0.GeneralProps[] {
    if (!error) {
      return []
    }
    const causeProps = this._getPropsFromUnknown(error)
    const causesProps: Error0.GeneralProps[] = [causeProps]
    if (!causeProps.cause) {
      return causesProps
    }
    if (maxLevel > 0) {
      causesProps.push(...this._getCausesPropsFromUnknown(this._getPropsFromUnknown(causeProps.cause), maxLevel - 1))
    }
    return causesProps
  }

  public static _getCausesPropsFromError0Props(
    error0Props: Error0.GeneralProps,
    maxLevel: number,
  ): Error0.GeneralProps[] {
    return [error0Props, ...this._getCausesPropsFromUnknown(error0Props.cause, maxLevel - 1)]
  }

  public static _getClosestPropValue<TPropKey extends keyof Error0.GeneralProps>(
    causesProps: Error0.GeneralProps[],
    propKey: TPropKey,
  ): NonNullable<Error0.GeneralProps[TPropKey]> | undefined {
    for (const causeProps of causesProps) {
      const propValue = causeProps[propKey]
      if (isFilled(propValue)) {
        return propValue
      }
    }
    return undefined
  }

  // private static getClosestByGetter<TResult>(
  //   causesProps: Error0.GeneralProps[],
  //   getter: (props: Error0.GeneralProps) => TResult,
  // ): NonNullable<TResult> | undefined {
  //   for (const causeProps of causesProps) {
  //     const result = getter(causeProps)
  //     if (isFilled(result)) {
  //       return result
  //     }
  //   }
  //   return undefined
  // }

  public static _getFilledPropValues<TPropKey extends keyof Error0.Input>(
    causesProps: Error0.GeneralProps[],
    propKey: TPropKey,
  ): Array<NonNullable<Error0.GeneralProps[TPropKey]>> {
    const values: Array<NonNullable<Error0.GeneralProps[TPropKey]>> = []
    for (const causeProps of causesProps) {
      const propValue = causeProps[propKey]
      if (isFilled(propValue)) {
        values.push(propValue)
      }
    }
    return values
  }

  public static _getMergedMetaValue(causesProps: Error0.GeneralProps[]): Meta0.ValueType {
    const metas = this._getFilledPropValues(causesProps, 'meta')
    if (metas.length === 0) {
      return {}
    } else if (metas.length === 1) {
      return metas[0]
    } else {
      return Meta0.mergeValues(metas[0], ...metas.slice(1))
    }
  }

  // stack

  public static _removeConstructorStackPart(stack: Error0.GeneralProps['stack']): Error0.GeneralProps['stack'] {
    if (!stack) {
      return stack
    }
    let lines = stack.split('\n')
    const removeAllLinesContains = (search: string) => {
      lines = lines.filter((line) => !line.includes(search))
    }
    removeAllLinesContains('at new Error0')
    removeAllLinesContains('at _toError0')
    removeAllLinesContains('at Error0.from')
    removeAllLinesContains('at Error0._toError0')
    return lines.join('\n')
  }

  public static _mergeStack(
    prevStack: Error0.GeneralProps['stack'],
    nextStack: Error0.GeneralProps['stack'],
  ): Error0.GeneralProps['stack'] {
    return [nextStack, prevStack].filter(Boolean).join('\n\n') || undefined
  }

  // transformations

  static isError0(error: unknown): error is Error0 {
    return error instanceof Error0
  }

  static isLikelyError0(error: unknown): error is Error0 {
    if (error instanceof Error0) {
      return true
    }

    if (typeof error === 'object' && error !== null) {
      if ('__I_AM_ERROR_0' in error && error.__I_AM_ERROR_0 === true) {
        return true
      }
    }

    return false
  }

  public static _toError0(error: unknown, inputOverride: Error0.Input = {}): Error0 {
    if (error instanceof Error0) {
      return error
    }

    if (typeof error === 'string') {
      return new Error0(error, inputOverride)
    }

    if (typeof error !== 'object' || error === null) {
      return new Error0({
        message: this.defaultMessage,
        ...inputOverride,
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const inputFromData = get(error, 'data', undefined)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (inputFromData) {
      if (Error0.isLikelyError0(inputFromData)) {
        return this._toError0(inputFromData, inputOverride)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    const inputFromDataError0 = get(error, 'data.error0', undefined)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (inputFromDataError0) {
      if (Error0.isLikelyError0(inputFromDataError0)) {
        return this._toError0(inputFromDataError0, inputOverride)
      }
    }

    return new Error0(this._getPropsFromUnknown(error, inputOverride))
  }

  static from(error: unknown, inputOverride?: Error0.Input): Error0 {
    return this._toError0(error, inputOverride)
  }

  static extend(props: {
    defaultMessage?: Error0.GeneralProps['message']
    defaultCode?: Error0.GeneralProps['code']
    defaultHttpStatus?: Error0.GeneralProps['httpStatus']
    defaultExpected?: Error0.GeneralProps['expected']
    defaultClientMessage?: Error0.GeneralProps['clientMessage']
    defaultMeta?: Meta0.Meta0OrValueTypeNullish
  }) {
    // eslint-disable-next-line consistent-this, @typescript-eslint/no-this-alias
    const parent = this
    return class Error0 extends parent {
      static override defaultMessage = props.defaultMessage ?? parent.defaultMessage
      static override defaultCode = props.defaultCode ?? parent.defaultCode
      static override defaultHttpStatus = props.defaultHttpStatus ?? parent.defaultHttpStatus
      static override defaultExpected = props.defaultExpected ?? parent.defaultExpected
      static override defaultClientMessage = props.defaultClientMessage ?? parent.defaultClientMessage
      static override defaultMeta = Meta0.extend(parent.defaultMeta, props.defaultMeta)
    }
  }

  static extendCollection<T extends Record<string, typeof Error0>>(
    classes: T,
    props: {
      defaultMessage?: Error0.GeneralProps['message']
      defaultCode?: Error0.GeneralProps['code']
      defaultHttpStatus?: Error0.GeneralProps['httpStatus']
      defaultExpected?: Error0.GeneralProps['expected']
      defaultClientMessage?: Error0.GeneralProps['clientMessage']
      defaultMeta?: Meta0.Meta0OrValueTypeNullish
    },
  ): T {
    return Object.fromEntries(Object.entries(classes).map(([name, Class]) => [name, Class.extend(props)])) as T
  }

  toJSON() {
    return {
      message: this.message,
      tag: this.tag,
      code: this.code,
      httpStatus: this.httpStatus,
      expected: this.expected,
      clientMessage: this.clientMessage,
      anyMessage: this.anyMessage,
      cause: this.cause,
      meta: Meta0.getValue(this.meta),
      stack: this.stack,
      __I_AM_ERROR_0: this.__I_AM_ERROR_0,
    }
  }
  static toJSON(error: unknown, inputOverride?: Error0.Input) {
    const error0 = this.from(error, inputOverride)
    return error0.toJSON()
  }

  toResponse(data?: Record<string, unknown>) {
    return Response.json(
      {
        ...this.toJSON(),
        ...data,
      },
      {
        status: this.httpStatus,
        statusText: this.message,
      },
    )
  }
}

export namespace Error0 {
  export interface Input {
    message?: string
    tag?: string
    code?: string
    httpStatus?: HttpStatusCode | HttpStatusCodeString
    expected?: boolean | ExpectedFn
    clientMessage?: string
    cause?: Error0Cause
    stack?: string
    meta?: Meta0.Meta0OrValueTypeNullish
    zodError?: ZodError
    axiosError?: AxiosError
  }

  export interface GeneralProps {
    message: Input['message']
    tag: Input['tag']
    code: Input['code']
    httpStatus: number | undefined
    expected: boolean | undefined
    clientMessage: Input['clientMessage']
    anyMessage: string | undefined
    cause: Input['cause']
    stack: Error['stack']
    meta: Meta0.ValueType
    zodError?: ZodError
    axiosError?: AxiosError
  }

  export type HttpStatusCodeString = keyof typeof HttpStatusCode
  export type Error0Cause = unknown
  export type ExpectedFn = (error: GeneralProps) => boolean | undefined
  export type JSON = ReturnType<Error0['toJSON']>
  export type Collection = Record<string, typeof Error0>
}
