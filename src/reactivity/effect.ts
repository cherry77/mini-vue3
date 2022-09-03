class ReactiveEffect{
  private _fn: any;

  // public scheduler? 这种写法需要注意下，之前不知道
  constructor(fn, public scheduler?){
    this._fn = fn
    this.scheduler = scheduler
  }
  run(){
    activeEffect = this
    return this._fn() // 调用结果要返回下
  }
}
const targetMap = new Map()
export function track(target, key){
  let depsMap = targetMap.get(target)
  if(!depsMap){
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let deps = depsMap.get(key)
  if(!deps){
    deps = new Set()
    depsMap.set(key, deps)
  }
  deps.add(activeEffect)
}

export function trigger(target, key){
  const depsMap = targetMap.get(target)
  const deps = depsMap.get(key)

  for(const effect of deps){
    if(effect.scheduler){
      effect.scheduler()
    }else{
      effect.run()
    }
  }
}

let activeEffect;
export function effect(fn, options: any = {}){
  const effect = new ReactiveEffect(fn, options.scheduler)
  effect.run()
  return effect.run.bind(effect) // 返回一个函数，需要指定下函数内部的this
}