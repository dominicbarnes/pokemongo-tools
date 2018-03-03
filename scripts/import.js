
const fs = require('fs')
const mkdir = require('mkdirp')
const path = require('path')

const graphql = require('./graphql')
const couchdb = require('./couchdb')

const metadata = path.resolve(__dirname, '../_couchdb/pokemongo-metadata')

main().catch(err => console.error(err))

async function main () {
  await couchdb.drop()
  await couchdb.pull()

  const docs = await graphql.import()
  await mkdir(metadata)
  for (const doc of docs) {
    fs.writeFileSync(path.resolve(metadata, `${doc._id}.json`), JSON.stringify(doc, null, 2))
  }

  await couchdb.update()

  console.log('local database ready, you can now perform the manual push operation')
}
