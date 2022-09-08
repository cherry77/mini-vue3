import { ReactiveEffect } from "./effect";

class ComputedRefImpl{
  private _dirty = true
  private _value: any
  private _effect: ReactiveEffect;

  constructor(getter){
    this._effect = new ReactiveEffect(getter,() => {
      if(!this._dirty){
        this._dirty = true // 在响应式属性改变的时候变为true, 因为调用get的时候需要重新执行getter
      }
    })
  }
  get value(){
    if(this._dirty){
      this._value = this._effect.run()
      this._dirty = false
    }
    return this._value
  }
  
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}