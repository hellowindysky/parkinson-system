# ruiyun-web

> 睿云 2.0 PC版

## 使用方法

``` bash
# 安装依赖 ———— 你拷贝了代码后需要做的第一件事
npm install

# 安装依赖之后，你就可以快乐地在本地运行项目啦！！ 端口号 8086 (在 config/index.js 设置)
npm run dev

# 压缩打包出生产代码，目标地址是 dist 目录，第一次执行会新建该目录
# 如果你希望更改项目在服务器上的部署路径，那么需要修改 config/index.js 文件下的 assetsPublicPath 属性值，默认是在域名下的根路径
# 冒号后面的是打包模式，不同模式下的打包会决定一些全局变量的值，例如 api 的公共 url
npm run build:beta
npm run build:pre
npm run build:prod
npm run build:alone

# 发布生产代码的同时，输出构建情况
npm run build:prod --report

# 如果你更改了 element-ui 的默认样式(一个 CSS 4 风格的 CSS 文件)，那么需要用这个命令进行编译一下，详情参考后面的 "关于 element-theme "
npm run et


# 后面这几个是关于测试的，我引入了这些模块，但目前还没有用上

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

> #### 如果 npm install 的时候出现 'PhantomJS not found on PATH'，并且进度条卡住不动的话，怎么办？

> 这是由于天朝的防火墙引起的，可以借助淘宝镜像来解决这个问题。用下面的命令单独安装 **phantomjs-prebuilt**

> `PHANTOMJS_CDNURL=https://npm.taobao.org/mirrors/phantomjs/ npm install phantomjs-prebuilt --save-dev`

> 如果你不想输入这么长的命令，那也可以在 **~/.npmrc** 文件中加入这一行

> `phantomjs_cdnurl = https://npm.taobao.org/mirrors/phantomjs/`

> 然后就可以正常 npm install 了。不过据我测试，有了 **package-lockage.json** 文件的帮助（因为它已经把每个依赖的下载地址指向了淘宝镜像），应该不会再出现进度条卡住的问题。详细情况请参考[这里](https://github.com/xhlwill/blog/issues/11)

---

> #### 如果 npm install 的过程太慢，甚至因为延时而导致错误，怎么办？

> 依然类似于上面的解决办法，借助淘宝镜像来下载依赖模块。将 'registry = https://registry.npm.taobao.org' 写入 **~/.npmrc** 文件，再 npm install 就会快很多。不过还是因为 **package-lockage.json** 的存在，你一般不会遇到这个问题。

## 项目结构
对于最外层的组件，是按照路由信息进行加载的。比方说你点击了菜单中的选项，就会直接改变路由，再根据 **src/router/index.js** 找到到底该加载哪些组件，而如果你直接在浏览器地址栏改变路由，也会起到同样的作用。也就是说，这些外层组件加载的决定因素就是路由地址。但是对于层级很深的子组件来说，并没有路由信息去表达这个状态。例如在毒物接触史当中添加一个新记录，这个时候路由信息是不会有变化的，一旦点击网页刷新，就会回到路由地址所能控制到的最深层级，而放弃这些层级过深的子组件。更多详情需要参看 [Vue-Router 官网](https://router.vuejs.org/zh-cn/) 。

另一个需要特别说明的是 Vuex。原则是，只在必要的情况下，才使用 Vuex 管理全局状态。包含在组件内部的数据就使用 Vue 的标准方式来进行包裹和传递。对于像 token，dictionary，typeGroup 这些不属于特定组件的信息，我们采用 Vuex 的方式对其进行管理。

## 打包方式
项目会通过 `npm run build` 命令打包成静态的代码，由于涉及到不同的发布环境，而不同的发布环境会影响到一些全局变量的取值（例如 API 的公共部分，以及整个项目的页面标题等等），因此需要在该命令后面加上 `:beta`，`:pre` 或者 `:prod` 来指定打包方式（命令写在 package.json 文件中）。如果你想知道这些全局变量是如何根据打包方式变化的，以及这几条命令是如何改变打包方式的，需要参看 **build/build.js**，**build/webpack.prod.conf.js**，和 **config** 下的各个文件。

## 依赖库
到我写下这段话之前，整个项目的依赖库都是通过包管理工具来进行整理的，也就是说它们全部装在了 node_modules 文件夹里(甚至包括 **normalize.css** 这样的单文件)，通过 `npm install` 命令就可以把所有需要的库全部下载。我避免去使用 script 标签直接引入线上库，也没有像其它项目那样把一些库的代码下载到本地后再 import 使用，一方面是我希望做到用法统一（在需要引入库文件的组件内使用 import 命令），另一方面在于这样易于管理（全部通过 **package.json** 文件来管理）。

> #### package-lockage 文件
> 这里稍微讲一下这个文件，它会强制指定每个依赖库的版本，以及依赖库的依赖库的版本（好绕口），这样就避免了不同机器环境下，因为不同版本插件所可能造成的问题。当 **package.json** 发生变化后再次执行 `npm install` ，如果 **node_modules** 目录发生变化，那么这个文件也会更新（因此它不需要也不应该被手动修改），可以说它完整地概述了 **node_modules** 目录的整个结构。这是 npm 5.0 版本推出的新特性，因此你 **需要将你的 npm 版本升级到 5.0 以上！** 更多内容请参考[官方文档](https://docs.npmjs.com/files/package-lock.json)

> #### 关于 jquery
> 这个著名的插件和它所代表的开发模式也值得在这里说明一下，由于 Vue 的组件开发是建立在数据驱动或者说状态驱动的思想上的，因此并不提倡去操作 DOM 元素，我迄今也没有在任何组件里面 import 这个插件。偶尔避免不了要去操作单个 DOM 元素时，Vue 也提供了 refs 这个属性供我们使用。你可能注意到 **package.json** 文件里面有注明了安装这个依赖，但实际上只要你没有真正地 import，webpack 在打包时就不会把这个库给打包进代码。如果日后因为某些库要使用到 jquery ，可能还是得重新让它回归，但目前我们还是尊重 Vue 的喜好，将这个有名的老家伙，挡在项目的门外吧。

## element-ui
项目用到的 UI 插件是饿了么出品的 **element-ui**，算是国内最好的几个Vue UI 插件之一了。在我们写项目时，它的 2.X 版本还没有出来，因此我们用到的还是 1.X 版本，这个版本中有一些不太合理的设计也影响到了我们的开发。例如下拉框组件的 change 事件从使用逻辑上来讲，应该是选择了下拉选项才会触发，但实际上，下拉框绑定的数据对象一旦发生变化就会触发（即有可能被代码触发，而不是被UI触发）。因此在做数据初始化的时候，要特别注意这个插件的一些特性。现在当你登录 [**element-ui** 官网](http://element-cn.eleme.io/1.4/#/zh-CN)，默认会跳转到 2.X 以后的最新版，如果你在项目中遇到问题需要参考时，记得将官网的版本切换到 1.X 版本。

> #### 关于element-theme
> **src/assets/styles/** 目录下有个 **element-variables.css** 文件，以 CSS4 的格式规定了 element-ui 组件的一些全局样式。我们利用它来编译出项目实际使用的 CSS，输出路径为 **src/assets/styles/element-theme**（因此这个路径下的文件是编译生成的，不需要也不应该被手动修改）。

> 编译工具是 **node_modules** 中的 **element-theme** 组件，这样我们就能用 `et` 命令对 **element-variables.css** 进行编译：

> `node_modules/.bin/et -c src/assets/styles/element-variables.css -o src/assets/styles/element-theme`

> 此命令被封装在 **package.json** 的脚本中，因此执行 `npm run et` 即可。

> #### 再谈自定义 element-ui
> 刚才提到了利用 **element-theme** 工具，对 **element-ui** 的默认样式文件进行编译，这个修改是全局性质的，而且可配置项并不是那么多。对于更加具体、更加灵活的 CSS 自定义，需要在组件本身的 CSS 部分，覆盖原始样式。一定要注意，此时组件的 `style` 标签不能加 `scoped` 选项，否则 webpack 对 CSS `class` 名字处理后将导致无法应用到 **element-ui** 组件上。那么，如果要保证这里自定义的 CSS 局限在我们可控的范围内，就需要利用好 CSS `class` 名字的组合关系。幸好，在 less 文件的嵌套式写法下，做到这一点是很方便的。

## 模态框
本项目多处使用到模态框，基本思想参考于知乎上[尤雨溪的回答](https://www.zhihu.com/question/35820643/answer/64646527#)。状态驱动，挂载在根组件，然后由子组件触发事件传递上来。

## 关于组件之间的通信
如果是父子组件之间的通信，则由子组件调用 `this.$emit()` 方法，父组件采用 `v-on` 进行监听就好了。如果是层级关联度较低的组件，则加入一个第三方的 Vue 实例对象充当中转站的作用，我们这里定义在了 **src/utils/bus.js** 中，使用的时候先 `import Bus from 'utils/bus.js'`，然后使用 `Bus.$emit()` 和 `Bus.$on()` 即可。值得注意的是，在组件卸载的时候记得 **解除建立在 `Bus` 上的事件监听**，因为绑定的回调函数不会随着组件卸载而自动销毁，一旦再次发生相应事件，则会报错。因此，对于使用了 `Bus.$on()` 的组件，需要在它的 `beforeDestroy` 钩子中，执行 `Bus.$off()`，将相关事件监听全部解除。详情参考[官网](https://cn.vuejs.org/v2/api/#vm-off-event-callback)。

## API的封装
项目的几乎所有请求，都是 post 请求，我们利用 axios 将这些请求统一封装成一个 Promise 对象，参看 src/api/common.js 文件的 encapsulatePromise 函数。除非网络错误或者后端错误，正常情况下返回的状态码都为 200。然后再查看返回的数据对象，下面有一个 code 值，只有当 code 值为 0 的时候才代表业务请求正确，如果是其它值代表业务逻辑上出现了一些错误，而具体的错误原因则由这个数据对象的 msg 属性值告知。

## Iconfont
这个后台项目使用到的小图标统一用 **Iconfont** 方式来管理，相对于传统的 png 图片，这种方式更加代码化，更容易控制全局一致的大小和颜色，有更多的网上资源可供利用，使用起来也更加优雅。在项目初期，我将生成的 iconfont 字体文件下载到了项目的 `src/assets/styles/iconfont` 文件夹内，并在 `src/main.js` 里面 import 进来。后来发现在阿里的 iconfont 网站上，直接动态生成在线的 css 链接，并在 `index.html` 中引入，更加利于实时管理和更新，就废除掉了原来的方法。因此 `src/assets/styles/iconfont` 文件夹目前没有实际作用，仅仅当作一个字体文件的备份而已。在线 iconfont 的项目地址在[这里](http://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.9&manage_type=myprojects&projectId=432330)
