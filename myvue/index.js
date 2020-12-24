import initData from './initData.js';
import Complier from './complier.js'
export default class mVue {
    constructor(options) {
        this.$options = options;
        this._watcher = [];
        initData(this)
        new Complier(this.$options.el, this);
    }
}