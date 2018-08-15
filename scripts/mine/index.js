const fs = require('fs-extra')
const path = require('path')
const stringify = require('json-stable-stringify')

const mine = require('./mine.js')

const root = path.resolve(__dirname, '../..')
const input = path.join(root, 'pokemongo-game-master/versions')
const output = path.join(root, '_couchdb/pokemongo-metadata')

module.exports = async function () {
  const data = new Map()
  // const files = await fs.readdir(input)
  // const versions = files.map(name => parseInt(name, 10)).filter(version => version > 0).sort()
  const versions = [ 'latest' ]

  console.log('importing GAME_MASTER data')
  for (const version of versions) {
    console.log('> version %s', version)
    const file = path.join(input, version.toString(), 'GAME_MASTER.json')
    const json = await fs.readJson(file)
    mine(data, json)
  }

  console.log('outputting %s CouchDB documents', data.size)
  for (const [ id, doc ] of data.entries()) {
    const file = path.join(output, `${id}.json`)
    await fs.writeFile(file, stringify(doc, { space: '  ' }))
  }
}
