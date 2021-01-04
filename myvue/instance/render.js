
import { createElement } from './../vdom/createElement.js';
import { createTextVNode } from './../vdom/vnode.js'
export function initRender(vm) {
    vm._vnode = null;
    vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
    vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
}

export function renderMixin(Vue) {
    installRenderHelpers(Vue.prototype)
    Vue.prototype._render = function () {
        const vm = this
        const { render, _parentVnode } = vm.$options
        let vnode
        try {
            // 虚拟 dom，render 是 $options 里的方法， _renderProxy 是在 init.js 中定义的绑定对象的。
            vnode = render.call(vm._renderProxy, vm.$createElement)
        } catch (e) {
            console.error('render出错')
        }
        if (Array.isArray(vnode) && vnode.length === 1) {
            vnode = vnode[0]
        }
        vnode.parent = _parentVnode
        return vnode
    }
}

function installRenderHelpers(target) {
    target._v = createTextVNode;
    // target._e = createEmptyVNode;
}