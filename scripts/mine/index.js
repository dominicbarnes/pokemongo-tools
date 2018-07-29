const fs = require('fs-extra')
const path = require('path')

const mine = require('./mine.js')

const root = path.resolve(__dirname, '../..')
const input = path.join(root, 'pokemongo-game-master/versions')
const output = path.join(root, '_couchdb/pokemongo-metadata')

module.exports = async function () {
  const data = new Map()
  const files = await fs.readdir(input)
  const versions = files.map(name => parseInt(name, 10)).filter(version => version > 0).sort()

  console.log('importing GAME_MASTER data')
  for (const version of versions) {
    console.log('> version %d', version)
    const file = path.join(input, version.toString(), 'GAME_MASTER.json')
    const json = await fs.readJson(file)
    mine(data, json)
  }

  console.log('outputting CouchDB documents')
  for (const [ key, value ] of data.entries()) {
    console.log('> %s', key)
    const file = path.join(output, `${key}.json`)
    await fs.outputJson(file, value, { spaces: 2 })
  }
}
