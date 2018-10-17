
const Case = require('case')

module.exports = function (m, data) {
  data.get('pokemonSettings').forEach(pokemon => {
    const id = pokemon.familyId
    m.set(id, { name: Case.title(id.replace('FAMILY_', '')) })
  })
}
