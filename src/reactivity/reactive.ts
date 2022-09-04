import { mutableHandler, readonlyHandler } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function reactive(raw) {
	return createActiveObject(raw, mutableHandler)
}

export function readonly(raw) {
	return createActiveObject(raw, readonlyHandler)
}

export function isReactive(value): boolean {
  // 注意下：不是响应式对象的情况，会返回undefined，需要！！转下
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value): boolean {
  return !!value[ReactiveFlags.IS_READONLY]
}

function createActiveObject(raw, baseHandler) {
	return new Proxy(raw, baseHandler)
}
