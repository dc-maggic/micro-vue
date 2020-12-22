// import {Watcher} from './watcher.js'
const Watcher = require('./watcher.js')
// 解析 HTML 的 DOM，绑定数据
export default class Complier {
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
                    if (attrName.indexOf('m-') === 0) {
                        // for(var i in node){console.log(i)}
                        const _vm = this.$vm;
                        node.onkeyup = function(e){_vm[key]=node.value}
                        const dir = attrName.substring(2);
                        new Watcher(this.$vm, key, this.updateInputValue, { node: node });
                        this.updateInputValue(this.$vm[key], "", { node })
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