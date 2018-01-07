
const { env } = require('./config')

let plugins = [
  require('postcss-import')(),
  require('postcss-url')({
    url: 'copy',
    assetsPath: 'assets',
    useHash: true
  })
]

if (env !== 'development') {
  plugins.push(require('cssnano')({ preset: 'default' }))
}

exports.plugins = plugins
