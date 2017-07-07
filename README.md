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
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 关于element-theme
根目录下有个element-variables.css文件，以CSS4的格式写好了自定义的element-theme样式，我们利用它来编译出项目所需要的CSS，目标文件夹是src/assets/styles/element-theme。编译工具是node_modules中的element-theme组件，这样我们就能用et命令对element-variables.css进行编译，命令为node_modules/.bin/et -w -o src/assets/styles，-w意味着启用watch模式。
