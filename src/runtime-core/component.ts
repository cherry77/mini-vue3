
export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type
  }
  return component
}

export function setupComponent(instance) {
  // initProps()
  // initSlot()

  // 处理有状态的组件
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  // 调用setup, 拿到setup的返回值
  const Component = instance.vnode.type
  const { setup } = Component
  if (setup) {
    // return function or object
    // if function: 默认是render函数
    // if object: 注入到组件上下文中
    const setupResult = setup();
    handleSetupResult(instance, setupResult)
  }
}
function handleSetupResult(instance, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  instance.render = Component.render
}

