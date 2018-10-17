
const couchdb = require('./couchdb')
const miner = require('./miner')

main().catch(err => console.error(err))

async function main () {
  await couchdb.drop()
  await couchdb.pull()
  await miner()
  await couchdb.update()
  console.log('local database ready, you can now perform the manual push operation')
}
