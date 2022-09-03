import { track, trigger } from './effect'

// 优化：只调用一次
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(false)

function createGetter(isReadonly = true) {
	return function get(target, key) {
		if (isReadonly) {
			// 收集依赖
			track(target, key)
		}
		return Reflect.get(target, key)
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
