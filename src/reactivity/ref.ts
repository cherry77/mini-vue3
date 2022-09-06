import { hasChanged, isObject } from '../shared'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImpl {
	private _value: any
	public dep
	private _rawValue: any
	public __v_isRef = true

	constructor(value) {
		this._value = convert(value) // 如果是对象，需要用reactive
		this._rawValue = value // 存储原始的值
		this.dep = new Set()
	}

	get value() {
		trackRefValue(this)
		return this._value
	}

	set value(newValue) {
		// set的时候需要跟rawValue判断下，因为this._value已经变成代理对象了
		if (!hasChanged(this._rawValue, newValue)) return

		this._value = convert(newValue)
		this._rawValue = newValue
		triggerEffects(this.dep)
	}
}

function convert(value) {
	return isObject(value) ? reactive(value) : value
}

function trackRefValue(ref) {
	if (isTracking()) {
		trackEffects(ref.dep)
	}
}

export function ref(value) {
	return new RefImpl(value)
}

export function isRef(ref) {
	return !!ref.__v_isRef
}

export function unRef(ref) {
	return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRefs) {
	return new Proxy(objectWithRefs, {
		get(target, key) {
			return unRef(Reflect.get(target, key))
		},
		set(target, key, newValue) {
			if (isRef(target[key]) && !isRef(newValue)) {
				return (target[key].value = newValue)
			} else {
				return Reflect.set(target, key, newValue)
			}
		},
	})
}
