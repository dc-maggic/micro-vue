import { Watcher } from ""

export function initLifecycle(vm) {
    const options = vm.$options
    let parent = options.parent
    if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
            parent = parent.$parent
        }
        parent.$children.push(vm)
    }

    vm.$parent = parent
    vm.$root = parent ? parent.$root : vm

    vm.$children = []
    vm.$refs = {}

    vm._watcher = null
    vm._inactive = null
    vm._directInactive = false
    vm._isMounted = false
    vm._isDestroyed = false
    vm._isBeingDestroyed = false
}

export function mountComponent(
    vm,
    el,
    hydrating
) {
    vm.$el = el
    if (!vm.$options.render) {
        vm.$options.render = createEmptyVNode
    }

    let updateComponent
    updateComponent = () => {
        vm._update(vm._render(), hydrating)
    }

    // 实例化观察，然后触发 updateComponent
    new Watcher(vm, updateComponent, noop, {
    }, true)
    hydrating = false
    if (vm.$vnode == null) {
        vm._isMounted = true
    }
    return vm
}
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
        const vm = this
        vm._vnode = vnode
        /* 
            虚拟DOM=>真实DOM
            1.第一次 dom 渲染
            2.对比虚拟 dom 再进行渲染
        */
    }

}