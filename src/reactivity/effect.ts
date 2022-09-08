import { extend } from "../shared"

let activeEffect;
let shouldTrack = false;

export class ReactiveEffect {
	private _fn: any
	deps = []
  active = true
  onStop?: () => void // ts在类中定义方法

	// public scheduler? 这种写法需要注意下，之前不知道
	constructor(fn, public scheduler?) {
		this._fn = fn
		this.scheduler = scheduler
	}
	run() {
    if(!this.active){
      return this._fn() // 调用结果要返回下
    }
    shouldTrack = true
		activeEffect = this

    const result = this._fn()
    // reset 
    shouldTrack = false
    return result
	}
	stop() {
    // 性能优化：避免多次stop
    if(this.active){
      cleanupEffect(this)
      if(this.onStop){
        this.onStop()
      }
      this.active = false
    }
	}
}

function cleanupEffect(effect) {
	effect.deps.forEach((dep: any) => {
		dep.delete(effect)
	})
  effect.deps.length = 0
}

const targetMap = new Map()
export function track(target, key) {
  // if(!activeEffect) return // 单纯获取响应式对象的属性时是undefined（指的是不在effect中时获取）
  // if(!shouldTrack) return // 是否需要收集依赖，stop后不需要收集依赖
  if(!isTracking()) return

	let depsMap = targetMap.get(target)
	if (!depsMap) {
		depsMap = new Map()
		targetMap.set(target, depsMap)
	}
	let dep = depsMap.get(key)
	if (!dep) {
		dep = new Set()
		depsMap.set(key, dep)
	}
	trackEffects(dep)
}

export function trackEffects(dep) {
  // 已经再dep中，不需要重复收集
  if(dep.has(activeEffect)) return

  dep.add(activeEffect)
	activeEffect.deps.push(dep)
}

export function isTracking() {
  return activeEffect && shouldTrack
}

export function trigger(target, key) {
	const depsMap = targetMap.get(target)
	const dep = depsMap.get(key)
	triggerEffects(dep)
}

export function triggerEffects(dep) {
  for (const effect of dep) {
		if (effect.scheduler) {
			effect.scheduler()
		} else {
			effect.run()
		}
	}
}

export function stop(runner) {
	runner.effect.stop()
}

export function effect(fn, options: any = {}) {
  // fn
	const _effect = new ReactiveEffect(fn, options.scheduler)
  // options
  // effect.onStop = options.onStop
  // Object.assign(_effect, options) // 更优雅的挂
  extend(_effect, options)
	_effect.run()

	const runner: any = _effect.run.bind(_effect)
	runner.effect = _effect
	return runner // 返回一个函数，需要指定下函数内部的this
}
