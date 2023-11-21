const path = require('path')

module.exports = {
  //webpack配置
  webpack: {
    //配置别名
    alias: {
      //约定，使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src')
    }
  }
}