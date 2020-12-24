class mVue {
    constructor(options) {
        this.$options = options;
        // this.$data = options.data;
        // this.observe(this.$data);
        this._watcher = [];
        initData(this)
        new Complier(this.$options.el, this);
    }
}

function isReserved(str) {
    const c = (str + '').charCodeAt(0)
    return c === 0x24 || c === 0x5F
}

function initData(vm) {
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
            // 源码是 props data 两者都代理到vm实例上，但是我的 micro-vue 不需要 prop
            proxy(vm, `_data`, key)
        }
    }
    // 这是vm._data 的，和上面的vm实例不一样
    observe(data, true)
}
const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
}

function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

function observe(value, asRootData) {
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

function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

class Observer {
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

function defineReactive(
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


let uid = 0;
class Dep {
    constructor() {
        this.id = uid++
        this.subs = []
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    notify() {
        const subs = this.subs.slice()
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}

Dep.target = null
const targetStack = []

function pushTarget(target) {
    targetStack.push(target)
    Dep.target = target
}

function popTarget() {
    targetStack.pop()
    Dep.target = targetStack[targetStack.length - 1]
}

class Watcher {
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
class Complier {
    constructor(el, vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;
        if (this.$el) {
            this.complie(this.$el);
        }
    }
    complie(el) {
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if (node.nodeType === 1) {  // 节点
                // [m-, @, :]开头的属性值
                const nodeAttrs = node.attributes;
                Array.from(nodeAttrs).forEach(attr => {
                    const attrName = attr.name;
                    const key = attr.value;
                    if (attrName==='m-model') {
                        const _vm = this.$vm;
                        node.onkeyup = function(e){_vm[key]=node.value}
                        new Watcher(this.$vm, key, this.updateInputValue, { node });
                        this.updateInputValue(this.$vm[key], "", { node })
                    } else if(attrName.indexOf('@')===0){
                        console.log(attrName.substring(1))
                    }
                })
            } else if (node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.nodeValue)) { //绑定数据
                var keys = RegExp.$1.trim().split('.');
                const len = keys.length;
                const key = keys.pop();
                const content = node.nodeValue;
                const opt = {
                    node,key,content
                }
                if (len === 1) {
                    new Watcher(this.$vm, key, this.updateNodeValue, opt)
                    this.updateNodeValue(this.$vm[key], "", opt)
                } else {
                    keys.unshift(this.$vm);
                    const obj = keys.reduce((a,b)=>a[b]);
                    new Watcher(obj, key, this.updateNodeValue, opt)
                    this.updateNodeValue(obj[key], "", opt)
                }
            }
            // 递归子节点
            if (node.childNodes && node.childNodes.length > 0) {
                this.complie(node)
            }
        })
    }
    
    updateNodeValue(value, oldValue, arg) {
        let content = arg.content;
        content = content.replace(/\{\{(.*)\}\}/,value)
        arg.node.nodeValue = content;
    }
    updateInputValue(value, oldValue, arg) {
        arg.node.value = value
    }
}