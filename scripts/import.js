
const path = require('path')
const protobuf = require('protobufjs')

const couchdb = require('./couchdb')
const miner = require('./miner')

const POGOProtos = path.resolve(__dirname, '../POGOProtos')

main().catch(err => console.error(err))

async function main () {
  const PokemonId = await protobuf.load(path.join(POGOProtos, 'src/POGOProtos/Enums/PokemonId.proto'))
  const PokemonType = await protobuf.load(path.join(POGOProtos, 'src/POGOProtos/Enums/PokemonType.proto'))

  const enums = Object.assign({}, PokemonId.POGOProtos.Enums, PokemonType.POGOProtos.Enums)

  await couchdb.drop()
  await couchdb.pull()
  await miner(enums)
  await couchdb.update()
  console.log('local database ready, you can now perform the manual push operation')
}
