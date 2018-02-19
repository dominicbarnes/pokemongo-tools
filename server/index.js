const config = require('../config')
const Hapi = require('hapi')
const { log, Logger } = require('./log')
const hoodie = require('@hoodie/server')
const path = require('path')
const PouchDB = require('pouchdb-core')
  .plugin(require('pouchdb-adapter-http'))
  .plugin(require('pouchdb-mapreduce'))

var server = new Hapi.Server()

server.connection({
  host: 'localhost',
  port: config.port,
  routes: {
    files: {
      relativeTo: path.resolve(__dirname, '../public')
    }
  }
})

server.register({
  register: require('good'),
  options: {
    reporters: {
      up: [
        { module: Logger }
      ]
    }
  }
}, function (err) {
  if (err) fatal(err)

  server.register({
    plugins: [ require('inert') ],
    register: hoodie,
    options: {
      PouchDB: PouchDB.defaults({ prefix: config.adminURL() })
    }
  }, function (err) {
    if (err) fatal(err)

    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: { path: '.' }
      }
    })

    server.ext('onPreResponse', function (request, h) {
      const { response } = request
      const is404 = response.isBoom && response.output.statusCode === 404
      const isHoodie = request.url.pathname.startsWith('/hoodie')
      if (is404 && !isHoodie) {
        return h.file('index.html').code(200)
      }
      return h.continue()
    })

    server.start(function (err) {
      if (err) fatal(err)
      log('info', 'server started')
    })
  })
})

process.on('uncaughtException', fatal)
process.on('unhandledRejection', r => log('error', r))

function fatal (err) {
  log('error', err.stack || err.message)
  process.exit(1)
}
