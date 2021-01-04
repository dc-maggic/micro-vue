/* 
data 的初始化主要过程也是做两件事，
一个是对定义 data 函数返回对象的遍历，
通过 proxy 把每一个值 vm._data.xxx 都代理到 vm.xxx 上；
另一个是调用 observe 方法观测整个 data 的变化，把 data 也变成响应式，
可以通过 vm._data.xxx 访问到定义 data 返回函数中对应的属性
*/
import { proxy } from './proxy.js';
import { observe } from '../observe/observe.js';
// 不允许 $ _ 开头
function isReserved(str) {
    const c = (str + '').charCodeAt(0)
    return c === 0x24 || c === 0x5F
}
export default function initData(vm) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? data.call(vm, vm) : data || {}
    const keys = Object.keys(data)
    const methods = vm.$options.methods
    let i = keys.length
    while (i--) {
        const key = keys[i]
        if (methods && Object.prototype.hasOwnProperty.call(methods, key)) {
            console.error(
                `Method "${key}" has already been defined as a data property.`,
                vm
            )
        }
        if (!isReserved(key)) {
            proxy(vm, `_data`, key)
        }
    }
    // 这是vm._data 的，和上面的vm实例不一样
    observe(data, true)
}