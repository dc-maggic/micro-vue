import {initMixin} from "./init.js"

function Vue(options) {
    if (!(this instanceof Vue)) {
       console.error('please use new.')
    }
    this._init(options)
}
initMixin(Vue)
export default Vue