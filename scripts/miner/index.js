const fs = require('fs-extra')
const path = require('path')
const stringify = require('json-stable-stringify')

const mine = require('./mine.js')

const root = path.resolve(__dirname, '../..')
const input = path.join(root, 'pokemongo-game-master')
const output = path.join(root, '_couchdb/pokemongo-metadata')

module.exports = async function (enums) {
  const data = new Map()

  console.log('importing GAME_MASTER data')

  const files = await fs.readdir(path.join(input, 'versions'))
  const versions = files.map(name => parseInt(name, 10)).filter(version => version > 0).sort()
  for (const version of versions) {
    console.log('> version %s', version)
    const file = path.join(input, 'versions', version.toString(), 'GAME_MASTER.json')
    const json = await fs.readJson(file)
    mine(data, json, false, enums)
  }

  const specials = await fs.readdir(path.join(input, 'special'))
  for (const special of specials) {
    console.log('> special %s', path.basename(special, '.json'))
    const file = path.join(input, 'special', special)
    const json = await fs.readJson(file)
    mine(data, json, true, enums)
  }

  console.log('outputting %s CouchDB documents', data.size)
  for (const [ id, doc ] of data.entries()) {
    const file = path.join(output, `${id}.json`)
    await fs.writeFile(file, stringify(doc, { space: '  ' }))
  }
}
