
const env = process.env.NODE_ENV || 'development'

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
