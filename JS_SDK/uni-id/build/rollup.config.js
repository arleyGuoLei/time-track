const { builtinModules } = require('module')
const { terser } = require('rollup-plugin-terser')
const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const copy = require('rollup-plugin-copy')
const json = require('@rollup/plugin-json')

const plugins = [resolve(), commonjs(), json()]
if (process.env.NODE_ENV === 'production') {
  plugins.push(
    terser({
      output: {
        comments: false
      }
    })
  )
}

module.exports = function (moduleName) {
  return {
    input: 'src/index.js',
    output: {
      file: './../../cloudfunctions-aliyun/common/uni-id/index.js',
      format: 'commonjs'
    },
    plugins: [
      ...plugins,
      copy({
        targets: [
          {
            src: 'ext/config.json',
            dest: 'dist'
          },
          {
            src: 'LICENSE',
            dest: 'dist',
            rename: 'LICENSE.md'
          }
        ]
      })],
    external: [
      ...builtinModules
    ]
  }
}
