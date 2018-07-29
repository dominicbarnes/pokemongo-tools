
const Case = require('case')
const POGOProtos = require('node-pogo-protos-vnext')

module.exports = function (m, data) {
  data.get('pokemonSettings').forEach(pokemon => {
    const id = `POKEMON_${pokemon.pokemonId}`

    if (pokemon.form) {
      const o = m.get(id)

      if (!o.forms) o.forms = {}

      const f = form(pokemon)
      o.forms[f] = merge(o.forms[f], document(pokemon, id))

      m.set(id, o)
    } else {
      const o = document(pokemon, id)

      if (m.has(id)) {
        m.set(id, merge(m.get(id), o))
      } else {
        m.set(id, o)
      }
    }
  })
}

function generation (dex) {
  switch (true) {
    case dex <= 151: return 1
    case dex <= 251: return 2
    case dex <= 386: return 3
    case dex <= 493: return 4
    case dex <= 649: return 5
    case dex <= 721: return 6
    case dex <= 802: return 7
    default: return -1
  }
}

function document (pokemon, id) {
  const dex = POGOProtos.Enums.PokemonId[pokemon.pokemonId]

  return {
    name: name(pokemon),
    dex: dex,
    family: pokemon.familyId,
    generation: generation(dex),
    types: [ pokemon.type, pokemon.type2 ].filter(Boolean).map(type),
    baseStats: {
      stamina: pokemon.stats.baseStamina,
      attack: pokemon.stats.baseAttack,
      defense: pokemon.stats.baseDefense
    },
    previousEvolution: pokemon.parentPokemonId
      ? `POKEMON_${pokemon.parentPokemonId}`
      : null,
    nextEvolutions: (pokemon.evolutionBranch || []).map(branch => {
      return {
        pokemon: `POKEMON_${branch.evolution}`,
        candy: branch.candyCost,
        item: branch.evolutionItemRequirement
      }
    }),
    quickMoves: moves(pokemon.quickMoves),
    chargeMoves: moves(pokemon.cinematicMoves),
    rarity: rarity(pokemon),
    buddyDistance: pokemon.kmBuddyDistance,
    height: pokemon.pokedexHeightM,
    weight: pokemon.pokedexWeightKg
  }
}

function name (pokemon) {
  const n = Case.title(pokemon.pokemonId)
    .replace('Female', '♀')
    .replace('Male', '♂')

  const f = form(pokemon)

  return f && f !== 'normal'
    ? `${n} (${Case.title(f)})`
    : n
}

function type (id) {
  return id.replace('POKEMON_TYPE_', '').toLowerCase()
}

function form (pokemon) {
  if (!pokemon.form) return null
  return pokemon.form.replace(pokemon.pokemonId + '_', '').toLowerCase()
}

function rarity (pokemon) {
  if (!pokemon.rarity) return null
  return pokemon.rarity.replace('POKEMON_RARITY_', '').toLowerCase()
}

function moves (ids) {
  return ids.map(id => `MOVE_${id}`).reduce((acc, key) => {
    acc[key] = false
    return acc
  }, Object.create(null))
}

function merge (prev, next) {
  if (!prev) return next
  return Object.assign(Object.create(null), next, {
    quickMoves: mergeMoves(prev.quickMoves, next.quickMoves),
    chargeMoves: mergeMoves(prev.chargeMoves, next.chargeMoves)
  })
}

function mergeMoves (a, b) {
  const c = Object.create(null)
  Object.keys(a).forEach(id => {
    c[id] = true
  })
  Object.keys(b).forEach(id => {
    c[id] = b[id]
  })
  return c
}
