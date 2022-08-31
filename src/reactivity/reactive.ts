import { track, trigger } from './effect'
export const reactive = (target) => {
  return new Proxy(target, {
    get(target, key){
      // 收集依赖
      track(target, key)
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      // 先执行（这里先执行，之前搞反了）
      const res = Reflect.set(target, key, value)
      // 再触发依赖
      trigger(target, key)
      return res
    },
  })
} 