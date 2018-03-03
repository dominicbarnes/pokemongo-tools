
const path = require('path')
const util = require('util')

const bootstrap = util.promisify(require('couchdb-bootstrap'))
const nano = require('nano-blue')

const database = 'pokemongo-metadata'
const local = 'http://admin:secret@localhost:5984'
const remote = 'https://pokemongo-metadata:readonly@c38aeb6d-2e18-40ca-b7e9-404da06abd39-bluemix.cloudant.com'

const client = nano(local)

exports.drop = async function () {
  console.log('dropping local database')
  try {
    await client.db.destroy(database)
  } catch (err) {
    console.warn('> error', err.message)
  }
}

exports.pull = async function () {
  while (true) {
    console.log('pulling from cloudant')
    try {
      await client.db.replicate(`${remote}/${database}`, database, {
        create_target: true,
        use_checkpoints: false
      })
      break
    } catch (err) {
      console.warn('> replication error', err.message)
    }
  }
}

exports.update = async function () {
  console.log('updating local database')
  await bootstrap(local, path.resolve(__dirname, '../_couchdb'))
}
