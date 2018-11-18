const fs = require('fs-extra')
const path = require('path')
const stringify = require('json-stable-stringify')
const sortBy = require('sort-by')

const mine = require('./mine.js')

const root = path.resolve(__dirname, '../..')
const input = path.join(root, 'pokemongo-game-master')
const output = path.join(root, '_couchdb/pokemongo-metadata')

module.exports = async function (enums) {
  const data = new Map()

  console.log('importing GAME_MASTER data')

  const files = await getFiles()
  for (const file of files) {
    console.log('>', file.name)
    const json = await fs.readJson(file.file)
    mine(data, json, !!file.special, enums)
  }

  console.log('outputting %s CouchDB documents', data.size)
  for (const [ id, doc ] of data.entries()) {
    const file = path.join(output, `${id}.json`)
    await fs.writeFile(file, stringify(doc, { space: '  ' }))
  }
}

async function getFiles () {
  const files = []

  const normal = await fs.readdir(path.join(input, 'versions'))
  for (const file of normal) {
    const timestamp = parseInt(file, 10)
    if (isNaN(timestamp)) continue
    const date = new Date(timestamp)

    files.push({
      date: date,
      name: stringifyDate(date),
      file: path.join(input, 'versions', file, 'GAME_MASTER.json'),
      special: false
    })
  }

  const special = await fs.readdir(path.join(input, 'special'))
  for (const file of special) {
    const [ when, name ] = path.basename(file, '.json').split('_')
    const year = parseInt(when.slice(0, 4), 10)
    const month = parseInt(when.slice(4, 6), 10)
    const day = parseInt(when.slice(6, 8), 10)
    const date = new Date(year, month, day)

    files.push({
      date: date,
      name: `${stringifyDate(date)} (${name})`,
      file: path.join(input, 'special', file),
      special: true
    })
  }

  files.sort(sortBy('date'))

  files.push({
    name: 'latest',
    file: path.join(input, 'versions/latest/GAME_MASTER.json'),
    special: false
  })

  return files
}

function stringifyDate (date) {
  const year = date.getFullYear().toString()
  const month = date.getMonth().toString().padStart(2, '0')
  const day = date.getDay().toString().padStart(2, '0')
  return [year, month, day].join('-')
}
