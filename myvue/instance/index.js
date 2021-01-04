import {initMixin} from "./init.js"
import {lifecycleMixin} from "./lifecycle.js"
import {renderMixin} from './render.js'

function Vue(options) {
    if (!(this instanceof Vue)) {
       console.error('please use new.')
    }
    this._init(options)
}
// 原型链上添加 _init 方法
initMixin(Vue)
// 原型链上添加 _update 方法
lifecycleMixin(Vue)
// 原型链上添加 _render 方法
renderMixin(Vue)

export default Vue