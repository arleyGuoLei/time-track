const TransformPages = require('uni-read-pages')
const { webpack } = new TransformPages()

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        ROUTES: webpack.DefinePlugin.runtimeValue(() => {
          const tfPages = new TransformPages({
            includes: ['path', 'name', 'aliasPath'],
          })
          console.log(
            'log =>  ~ file: vue.config.js ~ line 12 ~ ROUTES:webpack.DefinePlugin.runtimeValue ~ tfPages',
            tfPages,
          )
          return JSON.stringify(tfPages.routes)
        }, true),
      }),
    ],
  },
}
