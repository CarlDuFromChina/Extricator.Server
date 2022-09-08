import { InternalServerErrorException } from "@nestjs/common";

const isNumber = (val: unknown): val is number => typeof val === 'number';
const isString = (val: unknown): val is string => typeof val === 'string';
const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol';
const isFunction = (val: unknown): val is Function => typeof val === 'function';
const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object';
const isArray = (val: unknown): val is Array<any> =>
  val != null && toString.call(val) === '[object Array]';
const isBoolean = (val: unknown): val is Boolean =>
  val != null && toString.call(val) === '[object Boolean]';

function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

/**
 * 是否为null或undefined
 * @param val
 * @returns boolean
 */
export function isNil(val: any): boolean {
  return val === undefined || val === null;
}

/**
 * 是否为空（仅支持 Array、String、Object）
 * @param val
 * @returns
 */
export function isEmpty(val: any): boolean {
  if (isNil(val)) {
    return true;
  } else if (isArray(val)) {
    return val.length === 0;
  } else if (isString(val)) {
    return val.trim().length === 0;
  } else if (isObject(val)) {
    return Object.keys(val).length === 0;
  }
  throw new TypeError('unsupport type');
}

/**
 * 是否相等
 * @param str1 
 * @param str2 
 * @param msg 
 */
export function isSame(str1: string, str2: string, msg: string) {
  if (str1 !== str2) {
    throw new InternalServerErrorException(msg);
  }
}

/**
 * 是否为真
 * @param isRight
 * @param msg 
 */
export function isTrue(isRight: boolean, msg: string) {
  if (isRight) {
    throw new InternalServerErrorException(msg);
  }
}

export default {
  isNil,
  isEmpty,
  isSame,
  isTrue,
  isNumber,
  isString,
  isSymbol,
  isFunction,
  isObject,
  isArray,
  isBoolean,
  isPromise
};
