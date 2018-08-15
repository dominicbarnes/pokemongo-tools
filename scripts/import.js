
const couchdb = require('./couchdb')
const mine = require('./mine')

main().catch(err => console.error(err))

async function main () {
  await couchdb.drop()
  // await couchdb.pull()
  await mine()
  await couchdb.update()
  console.log('local database ready, you can now perform the manual push operation')
}
