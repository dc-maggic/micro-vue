

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
    }
}