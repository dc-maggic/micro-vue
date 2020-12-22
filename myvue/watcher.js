

/**
作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新
 */

import { pushTarget, popTarget } from './dep.js'
export default class Watcher {
    constructor(vm, key, cb, arg) {
        this.vm = vm;
        this.key = key;
        this.active = true;
        this.value = this.get();
        this.arg = arg;
        this.cb = cb;
    }
    // 触碰所有数据的 getter 
    get() {
        let value
        pushTarget(this)
        try {
            value = this.vm[this.key]
        } catch (e) {
            console.error(e)
        } finally {
            popTarget()
        }
        return value
    }

    update() {
        this.cb.call(this.vm, this.vm[this.key], undefined, this.arg)
    }
    run() {
        if (this.active) {
            const value = this.get()
            const oldValue = this.value
            this.value = value
            this.cb.call(this.vm, this.vm[this.key], oldValue, this.arg)
        }
    }
}