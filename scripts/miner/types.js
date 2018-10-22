
const POGOProtos = require('node-pogo-protos-vnext')
const sortBy = require('sort-by')

module.exports = function (m, data) {
  if (!data.has('typeEffective')) return

  const list = Array.from(data.get('typeEffective')).map(effective => {
    const id = effective.attackType

    return {
      name: id.replace('POKEMON_TYPE_', '').toLowerCase(),
      sort: POGOProtos.Enums.PokemonType[id],
      multipliers: effective.attackScalar
    }
  })

  list.sort(sortBy('sort'))

  m.set('TYPES', {
    list: list.map(item => item.name),
    matrix: list.map(item => item.multipliers)
  })
}
