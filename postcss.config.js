
const { env } = require('./config')

let plugins = [
  require('postcss-import')(),
  require('postcss-url')({ url: 'inline' })
]

if (env !== 'development') {
  plugins.push(require('cssnano')({ preset: 'default' }))
}

exports.plugins = plugins
