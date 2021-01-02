import { extend } from "./../util/index.js"
export function initGlobalAPI(mVue) {
    const configDef = {}
    Object.defineProperty(mVue, 'config', configDef)
    mVue.util = {
    }
    mVue.options = Object.create(null)
    mVue.options.components = Object.create(null)

    mVue.options._base = mVue
    initExtend(mVue)
    initAssetRegisters(mVue)
}
// 看完源码以后，可以合理认为 extend 就是创造 mvue 的子类，继承它的方法等。
function initExtend(mVue) {
    mVue.cid = 0
    let cid = 1
    mVue.extend = function (extendOptions) {
        extendOptions = extendOptions || {}
        const Super = this
        const SuperId = Super.cid
        const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
        if (cachedCtors[SuperId]) {
            return cachedCtors[SuperId]
        }
        const name = extendOptions.name || Super.options.name
        // Sub 是继承于 mVue
        const Sub = function VueComponent(options) {
            this._init(options)
        }
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        Sub.cid = cid++
        Sub.options = mergeOptions(
            Super.options,
            extendOptions
        )
        Sub['super'] = Super
        Sub.extend = Super.extend
        Sub.components = Super.components
        if (name) {
            Sub.options.components[name] = Sub
        }

        Sub.superOptions = Super.options
        Sub.extendOptions = extendOptions
        Sub.sealedOptions = extend({}, Sub.options)
        cachedCtors[SuperId] = Sub
        return Sub
    }
}
// 全局组件
function initAssetRegisters(mVue) {
    mVue.components = function (
        id,
        definition
    ) {
        if (!definition) {
            return this.options.components[id]
        } else {
            if (definition.toString() === '[object Object]') {
                definition.name = definition.name || id
                definition = this.options._base.extend(definition)
            }
            this.options[type + 's'][id] = definition
            return definition
        }
    }

}
