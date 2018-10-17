
const couchdb = require('./couchdb')
const miner = require('./miner')

main().catch(err => console.error(err))

async function main () {
  await miner()
  await couchdb.update()
}
