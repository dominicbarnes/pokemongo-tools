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
exports.couchdbURL = process.env.hoodie_dbUrl
exports.metadataUsername = process.env.METADATA_USERNAME
exports.metadataPassword = process.env.METADATA_PASSWORD

exports.metadataURL = function () {
  const { couchdbURL, metadataUsername, metadataPassword } = exports
  const u = url.parse(couchdbURL)
  if (metadataUsername && metadataPassword) {
    u.auth = `${metadataUsername}:${metadataPassword}`
  }
  u.pathname = '/pokemongo-metadata'
  return url.format(u)
}
