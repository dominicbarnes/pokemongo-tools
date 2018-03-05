const url = require('url')
const pkg = require('./package.json')

// meta
exports.version = pkg.version

// env
exports.env = process.env.NODE_ENV || 'development'
exports.stage = process.env.UP_STAGE || 'development'

// server
exports.port = process.env.PORT || 8080

// db
exports.couchdbURL = process.env.COUCHDB_URL || 'http://localhost:5984'
exports.adminUsername = process.env.ADMIN_USERNAME || 'admin'
exports.adminPassword = process.env.ADMIN_PASSWORD || 'secret'
exports.metadataUsername = process.env.METADATA_USERNAME
exports.metadataPassword = process.env.METADATA_PASSWORD
exports.segmentWriteKey = process.env.SEGMENT_WRITE_KEY

exports.adminURL = function () {
  const { couchdbURL, adminUsername, adminPassword } = exports
  const u = url.parse(couchdbURL)
  if (adminUsername && adminPassword) {
    u.auth = `${adminUsername}:${adminPassword}`
  }
  return url.format(u)
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
