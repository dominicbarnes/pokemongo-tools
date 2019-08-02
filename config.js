const url = require('url')
const pkg = require('./package.json')

// meta
exports.version = pkg.version

// env
exports.env = process.env.NODE_ENV || 'development'
exports.stage = process.env.UP_STAGE || 'development'

// metrics
exports.segmentWriteKey = process.env.SEGMENT_WRITE_KEY

// db
if (exports.env === 'development') {
  exports.couchdbURL = 'http://localhost:5984/'
  exports.metadataUsername = 'admin'
  exports.metadataPassword = 'secret'
} else {
  exports.couchdbURL = 'https://c38aeb6d-2e18-40ca-b7e9-404da06abd39-bluemix.cloudant.com/'
  exports.metadataUsername = 'pokemongo-metadata'
  exports.metadataPassword = 'readonly'
}

exports.metadataURL = function () {
  const { couchdbURL, metadataUsername, metadataPassword } = exports
  const u = url.parse(couchdbURL)
  if (metadataUsername && metadataPassword) {
    u.auth = `${metadataUsername}:${metadataPassword}`
  }
  u.pathname = '/pokemongo-metadata'
  return url.format(u)
}
