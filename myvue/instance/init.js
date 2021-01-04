import {initRender} from "./render.js"
import {initData} from "./initData.js"

let uuid = 0;
export function initMixin(mVue) {
    mVue.prototype._init = function (options) {
        const vm = this;
        vm._uuid = uuid++;
        vm._isVue = true;
        // if (options && options._isComponent) {
        //     initInternalComponent(vm, options)
        // } else {
        //     vm.$options = mergeOptions(
        //         resolveConstructorOptions(vm.constructor),
        //         options || {},
        //         vm
        //     )
        // }

        vm._renderProxy = vm
        vm._self = vm
        // 添加vm._c、vm.$createElement，两种都是调用 createElement 方法
        initRender(vm)
        // 初始化各种，但是这里只初始化 data
        initData(vm);
        // 调用的是原型链的 mount 方法
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
}