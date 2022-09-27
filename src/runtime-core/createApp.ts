import { render } from "./renderer"
import { createVNode } from "./vnode"

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // component -> vnode, 后面所有的操作都基于虚拟节点
      const vnode = createVNode(rootComponent)
      // 调用render函数
      render(vnode, rootContainer)
    }
  }
}