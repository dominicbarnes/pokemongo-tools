
const { Transform } = require('stream')
const util = require('util')

exports.Logger = Logger
exports.log = log

function Logger () {
  Transform.call(this, {
    objectMode: true,
    transform: transform
  })
}

function transform (data, enc, next) {
  const { event } = data

  if (event === 'error') {
    const { error, method, url } = data
    const type = error.name
    log('error', error.message, { type, method, url })
  } else if (event === 'response') {
    const { method, path, query, statusCode, responseTime } = data
    const status = statusCode
    const duration = responseTime
    log('info', 'response', { method, path, query, status, duration })
  } else if (event === 'request') {
    const { method, path } = data
    log('info', 'request', { method, path })
  } else if (event === 'ops') {
    const { os, proc, load } = data
    log('info', 'ops', { os, proc, load })
  }

  return next(null, data)
}

util.inherits(Logger, Transform)

function log (level, message, fields) {
  console.log(JSON.stringify({ level, message, fields }))
}
