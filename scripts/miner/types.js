
const sortBy = require('sort-by')

module.exports = function (m, data, special, { PokemonType }) {
  if (!data.has('typeEffective')) return

  const list = Array.from(data.get('typeEffective')).map(effective => {
    const id = effective.attackType

    return {
      name: id.replace('POKEMON_TYPE_', '').toLowerCase(),
      sort: PokemonType[id],
      multipliers: effective.attackScalar
    }
  })

  list.sort(sortBy('sort'))

  m.set('TYPES', {
    list: list.map(item => item.name),
    matrix: list.map(item => item.multipliers)
  })
}
