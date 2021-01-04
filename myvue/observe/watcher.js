

/**
作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新
 */

import { pushTarget, popTarget } from './dep.js'
export default class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;
        this.active = true;
        this.cb = cb;
        this.getter = expOrFn;
        this.value = this.get()
    }
    // 触碰所有数据的 getter 
    get() {
        let value
        pushTarget(this)
        try {
            value = this.getter.call(vm, vm)
        } catch (e) {
            console.error(e)
        } finally {
            popTarget()
        }
        return value
    }

    update() {
        this.run();
    }
    run() {
        if (this.active) {
            const value = this.get()
            const oldValue = this.value
            this.value = value
            this.cb.call(this.vm, this.value, oldValue)
        }
    }
}