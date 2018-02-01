const path = require('path');
const webpack = require('webpack');
const package = require('../package.json')

module.exports = {
  entry: {
    // 读取 package.json 里的依赖，normalize.css除外，打包会报错
    // 如果需要使用 chrome 的 vue-devtool，那打包的时候需要把 vue也排除掉，因为压缩过的 vue 是不能使用 vue-devtool 的
    vendor: Object.keys(package.dependencies).filter((dependencyName) => {
      return dependencyName.indexOf('normalize') < 0 &&
        dependencyName.indexOf('babel-runtime') < 0 &&
        dependencyName.indexOf('particles') < 0;
    })
  },
  output: {
    path: path.join(__dirname, '../static/js'),
    filename: '[name].dll.js',
    library: '[name]_library' // 生成文件的一些映射关系，与下面 DllPlugin 中配置对应
  },
  plugins: [
    // 使用 DllPlugin 插件编译上面配置的 NPM 包
    new webpack.DllPlugin({
      // 会生成一个json文件，里面是关于 dll.js 的一些配置信息
      path: path.join(__dirname, '[name]-manifest.json'),
      name: '[name]_library', // 与上面 output 中配置对应
      context: __dirname
    })
  ]
};
