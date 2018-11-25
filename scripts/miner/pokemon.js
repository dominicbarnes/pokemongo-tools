
const Case = require('case')
const costumes = require('./costumes.json')

module.exports = function (m, data, special, enums) {
  const pokemon = new Map()

  if (data.has('pokemonSettings')) {
    // set up all the base/normal forms (skip any alternate forms)
    data.get('pokemonSettings').forEach(settings => {
      if (settings.form) return
      pokemon.set(`POKEMON_${settings.pokemonId}`, document(settings, enums))
    })

    // set up alternate forms that have their own metadata/stats
    data.get('pokemonSettings').forEach(settings => {
      if (!settings.form) return
      const doc = pokemon.get(`POKEMON_${settings.pokemonId}`)
      const f = form(settings)
      if (!doc.forms) doc.forms = Object.create(null)
      doc.forms[f] = document(settings, enums)
    })
  }

  if (data.has('formSettings')) {
    // extract asset bundle ids for alternate forms
    data.get('formSettings').forEach(settings => {
      if (!settings.forms) return
      const doc = pokemon.get(`POKEMON_${settings.pokemon}`)
      settings.forms.forEach(form => {
        if (typeof form.form !== 'string') return // HACK
        const f = form.form.replace(`${settings.pokemon}_`, '').toLowerCase()
        if (!doc.forms) doc.forms = Object.create(null)
        if (!doc.defaultForm) doc.defaultForm = f
        if (!doc.forms[f]) {
          doc.forms[f] = { name: `${doc.name} (${Case.title(f)})`, assetBundle: form.assetBundleValue }
        } else {
          doc.forms[f].assetBundle = form.assetBundleValue
        }
      })
    })
  }

  for (const [ id, doc ] of pokemon.entries()) {
    if (m.has(id)) {
      m.set(id, merge(m.get(id), doc, special))
    } else {
      m.set(id, doc)
    }
  }
}

function generation (dex) {
  switch (true) {
    case dex <= 151: return 1
    case dex <= 251: return 2
    case dex <= 386: return 3
    case dex <= 493: return 4
    case dex <= 649: return 5
    case dex <= 721: return 6
    case dex <= 809: return 7
    default: return -1
  }
}

function document (pokemon, { PokemonId }) {
  const dex = PokemonId[pokemon.pokemonId]

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
        item: branch.evolutionItemRequirement,
        form: branch.form ? branch.form.replace(branch.evolution + '_', '').toLowerCase() : undefined
      }
    }),
    quickMoves: moves(pokemon.quickMoves),
    chargeMoves: moves(pokemon.cinematicMoves),
    rarity: rarity(pokemon),
    buddyDistance: pokemon.kmBuddyDistance,
    height: pokemon.pokedexHeightM,
    weight: pokemon.pokedexWeightKg,
    costumes: costumes[pokemon.familyId]
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
  if (!pokemon.rarity) return 'common'
  return pokemon.rarity.replace('POKEMON_RARITY_', '').toLowerCase()
}

function moves (ids) {
  return ids.map(id => `MOVE_${id}`).reduce((acc, key) => {
    acc[key] = false
    return acc
  }, Object.create(null))
}

function merge (prev, next, special) {
  if (!prev) return next
  return Object.assign(Object.create(null), prev, next, {
    quickMoves: mergeMoves(prev.quickMoves, next.quickMoves, special),
    chargeMoves: mergeMoves(prev.chargeMoves, next.chargeMoves, special)
  })
}

function mergeMoves (a, b, special) {
  const c = Object.create(null)
  if (a) {
    Object.keys(a).forEach(id => {
      c[id] = typeof a[id] === 'boolean' ? true : a[id]
    })
  }
  if (b) {
    Object.keys(b).forEach(id => {
      if (special) {
        c[id] = 'special'
      } else if (id in c) {
        c[id] = b[id]
      } else {
        c[id] = false
      }
    })
  }
  return c
}
