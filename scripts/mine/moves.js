
const Case = require('case')

module.exports = function (m, data) {
  const types = Array.from(data.get('typeEffective')).map(effective => {
    return effective.attackType.replace('POKEMON_TYPE_', '').toLowerCase()
  })

  data.get('moveSettings').forEach(move => {
    if (move.movementId === 'HIDDEN_POWER_FAST') {
      types.forEach(type => {
        const id = `MOVE_HIDDEN_POWER_${type.toUpperCase()}_FAST`
        m.set(id, {
          name: 'Hidden Power',
          type: move.pokemonType.replace('POKEMON_TYPE_', '').toLowerCase(),
          power: move.power,
          quick: id.endsWith('_FAST')
        })
      })
    } else {
      const id = `MOVE_${move.movementId}`
      m.set(id, {
        name: Case.title(id.replace(/^MOVE_(.*?)(_FAST)?$/, '$1')),
        type: move.pokemonType.replace('POKEMON_TYPE_', '').toLowerCase(),
        power: move.power,
        quick: id.endsWith('_FAST')
      })
    }
  })
}