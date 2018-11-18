
const miner = require('./miner')
const path = require('path')
const protobuf = require('protobufjs')

const POGOProtos = path.resolve(__dirname, '../../POGOProtos')

main().catch(err => console.error(err))

async function main () {
  const PokemonId = await protobuf.load(path.join(POGOProtos, 'src/POGOProtos/Enums/PokemonId.proto'))
  const PokemonType = await protobuf.load(path.join(POGOProtos, 'src/POGOProtos/Enums/PokemonType.proto'))

  const enums = Object.assign({}, PokemonId.POGOProtos.Enums, PokemonType.POGOProtos.Enums)

  await miner(enums)
}
