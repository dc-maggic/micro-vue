# 微型vue
功能：
1. 具备数据双向绑定
2. 响应式数据
3. 在数据更替时，Node 里的默认文字依旧显示

未开发：
1. virtual DOM
1. Component
2. 数据暂不支持 Array

文件结构
-initData 将 data 中的数据绑定到 mVue 的实例中，以及将数据变成响应式。
-observe 监听数据并响应，即核心 Object.defineProperty(object, key, {get,set})
-dep 收集依赖、触发监听器
-complier 解析 HTML，在遇到数据时，绑定一个监听器 Watcher并触发。
-watcher 监听器，派发更新

## 模版语法
### “Mustache”语法 (双大括号) 的文本插值
```html
<span>{{author}}</span>
```
### 表单输入绑定
```html
<input type="text" m-model="author">
<span>{{author}}</span>
```

开发过程：
vue 源码都在 src 文件里
src
├── compiler        # 编译 
├── core            # 核心代码 
    ├── components  #组件
    ├── global-api  #公共api
    ├── instance    #实例
    ├── observer    #观察
        ├   array.js    #数组的处理
        ├   dep.js      #收集依赖
        ├   index.js    
        ├   scheduler.js   
        ├   traverse.js
        ├   watcher.js  #watcher 类
    ├── util        #工具函数
    ├── vdom        #虚拟 dom
    ├   config.js
    ├   index.js
├── platforms       # 不同平台的支持（web、小程序）
├── server          # 服务端渲染
├── sfc             # .vue 文件解析
├── shared          # 公共方法

当 new Vue时，会先调用 [this._init(options) 方法](./vue/src/core/instance/index.js)，这个方法定义在 [init.js](./vue/src/core/instance/init.js) 中，init 做了initLifecycle()初始化生命周期、initEvents(vm)初始化事件、initRender(vm)初始化渲染、callHook(vm, 'beforeCreate')初始化实例之前生命、initInjections(vm)解决prop||data之前的事件、initState(vm)初始化各种数据（data、prop、computed、watch）等事情。
本次研究的是 [initState(vm)](./vue/src/core/instance/state.js) 中的 [initData(vm)](./vue/src/core/instance/state.js)。
