var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    vendor: [
      'axios',
      'element-ui',
      'es6-promise',
      'md5',
      'particles.js',
      'perfect-scrollbar',
      'vue',
      'vue-router',
      'vuex'
    ]
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
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library', // 与上面 output 中配置对应
      context: __dirname
    })
  ]
};
