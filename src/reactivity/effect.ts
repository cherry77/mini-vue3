class ReactiveEffect{
  private _fn: any;

  constructor(fn){
    this._fn = fn
  }
  run(){
    activeEffect = this
    this._fn()
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
    effect.run()
  }
}

let activeEffect;
export function effect(fn){
  const effect = new ReactiveEffect(fn)
  effect.run()
}