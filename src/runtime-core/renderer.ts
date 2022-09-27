import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
  // patch
  patch(vnode, container)
}

function patch(vnode, container) {
  // 处理组件 const App = { render(){}, setup(){} }
  processComponent(vnode, container)

  // 处理element eg: return h('div', ...) 这种情况
  processElement(vnode, container)
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}
function mountComponent(vnode: any, container) {
  // 创建组件实例
  const instance = createComponentInstance(vnode)

  // 挂一些props slot等
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container) {
  // 调用render函数， subTree：vnode树
  const subTree = instance.render()

  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container)
}

function processElement(vnode: any, container: any) {
  throw new Error("Function not implemented.")
}

