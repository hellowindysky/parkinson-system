# ruiyun-web

> A new version of ruiyun web

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test

# compile element-theme css
npm run et
```

#### 如果 npm install 的时候出现 'PhantomJS not found on PATH'，并且进度条卡住不动的话

这是由于天朝的防火墙引起的，可以借助淘宝镜像来解决这个问题。用下面的命令单独安装 **phantomjs-prebuilt**

`PHANTOMJS_CDNURL=https://npm.taobao.org/mirrors/phantomjs/ npm install phantomjs-prebuilt --save-dev`

或者在 **~/.npmrc** 文件中加入这一行

`phantomjs_cdnurl = https://npm.taobao.org/mirrors/phantomjs/`

然后就可以正常 npm install 了。不过据我测试，有了package-lockage.json文件的帮助，应该不会再出现进度条卡住的问题。详细情况请参考[这里](https://github.com/xhlwill/blog/issues/11)

#### 如果 npm install 的过程太慢，甚至因为延时而导致错误

依然类似于上面的解决办法，借助淘宝镜像来下载依赖模块。将 'registry = https://registry.npm.taobao.org' 写入 **~/.npmrc** 文件，再 npm install 就会快很多


## 关于element-theme

src/assets/styles/目录下有个element-variables.css文件，以CSS4的格式写好了自定义的element-theme样式，我们利用它来编译出项目所需要的CSS，目标文件夹是src/assets/styles/element-theme。编译工具是node_modules中的element-theme组件，这样我们就能用et命令对element-variables.css进行编译：node_modules/.bin/et -c src/assets/styles/element-variables.css -o src/assets/styles/element-theme。此命令被封装在package.json的脚本中，因此执行npm run et即可。

## 模态框
本项目多处使用到模态框，基本思想参考于知乎上尤雨溪的这个回答。状态驱动，挂载在根组件，然后由子组件触发事件传递上来。
https://www.zhihu.com/question/35820643/answer/64646527#
