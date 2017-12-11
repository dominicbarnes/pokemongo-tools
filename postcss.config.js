
const ENV = process.env.NODE_ENV || 'development'

let plugins = [
  require('postcss-import')(),
  require('postcss-url')({ url: 'inline' })
]

if (ENV !== 'development') {
  plugins.push(require('cssnano')({ preset: 'default' }))
}

exports.plugins = plugins
