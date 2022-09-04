import { isObject } from '../shared'
import { track, trigger } from './effect'
import { ReactiveFlags, reactive, readonly } from './reactive'

// 优化：只调用一次
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
	return function get(target, key) {
		if (key === ReactiveFlags.IS_REACTIVE) {
			return !isReadonly
		} else if (key === ReactiveFlags.IS_READONLY) {
			return isReadonly
		}

		const result = Reflect.get(target, key)
		if (isObject(result)) {
			return isReadonly ? readonly(result) : reactive(result)
		}

		if (!isReadonly) {
			// 收集依赖
			track(target, key)
		}
		return result
	}
}
function createSetter() {
	return function set(target, key, value) {
		// 先执行（这里先执行，之前搞反了）
		const res = Reflect.set(target, key, value)
		// 再触发依赖
		trigger(target, key)
		return res
	}
}
export const mutableHandler = {
	get,
	set,
}
export const readonlyHandler = {
	get: readonlyGet,
	set(target, key, value) {
		console.warn(`set failed. ${target} is readonly.`)
		return true
	},
}
