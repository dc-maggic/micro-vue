
/* 
作用：监测数据的变化
value 是 vm 的 data
asRootData 是否是根数据
*/
import { Dep } from './dep.js'
export function observe(value, asRootData) {
    if (typeof value !== 'object') {
        return
    }
    let ob;
    if (Object.prototype.hasOwnProperty.call(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    } else if (
        // 只考虑 Object， 不带 Array。
        Object.prototype.toString.call(value) === "[object Object]"
    ) {
        ob = new Observer(value)
    }
    if (asRootData && ob) {
        ob.vmCount++
    }
    return ob
}

// define Object
function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}


export class Observer {
    constructor(value) {
        this.value = value
        this.dep = new Dep()
        this.vmCount = 0
        def(value, '__ob__', this)
        this.walk(value)
    }
    walk(obj) {
        const keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(obj, keys[i])
        }
    }
}

export function defineReactive(
    obj,
    key,
    val,
    shallow
) {
    const dep = new Dep()
    const property = Object.getOwnPropertyDescriptor(obj, key)
    const getter = property && property.get
    const setter = property && property.set
    if ((!getter || setter) && arguments.length === 2) {
        val = obj[key]
    }
    let childOb = !shallow && observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            const value = getter ? getter.call(obj) : val
            // 在 complie 时触发getter，然后添加监听
            // Dep.target && dep.addSub(Dep.target);
            if (Dep.target) {
                dep.addSub(Dep.target)
                if (childOb) {
                    console.log(childOb)
                  childOb.dep.addSub(Dep.target)
                }
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            const value = getter ? getter.call(obj) : val
            if (newVal === value || (newVal !== newVal && value !== value)) {
                return
            }
            val = newVal
            dep.notify()
        }
    })
}