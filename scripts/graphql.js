
const { GraphQLClient } = require('graphql-request')

const client = new GraphQLClient('https://61heu9qv1g.execute-api.us-west-2.amazonaws.com/production/graphql', {
  headers: {
    Accept: 'application/json'
  }
})

const query = `{
  pokemon {
    id
    name
    dex
    generation
    types
    baseStats {
      stamina
      attack
      defense
    }
    previousEvolution {
      id
    }
    nextEvolutions {
      pokemon {
        id
      }
      candy
      item {
        id
      }
    }
    quickMoves {
      id
      legacy
    }
    chargeMoves {
      id
      legacy
    }
    rarity
    maxCP
    buddyDistance
    height
    weight
    family {
      id
    }
    forms {
      form
      pokemon {
        id
        name
        dex
        generation
        types
        baseStats {
          stamina
          attack
          defense
        }
        previousEvolution {
          id
        }
        nextEvolutions {
          pokemon {
            id
          }
          candy
          item {
            id
          }
        }
        quickMoves {
          id
          legacy
        }
        chargeMoves {
          id
          legacy
        }
        rarity
        maxCP
        buddyDistance
        height
        weight
        family {
          id
        }
      }
    }
  }
  types {
    list
    matrix
  }
  moves {
    id
    name
    type
    power
  }
  families {
    id
    name
  }
  cpMultipliers {
    level
    multiplier
  }
}`

exports.import = async function () {
  return docs(await client.request(query))
}

function docs (data) {
  return []
    .concat(types(data.types))
    .concat(pokemon(data.pokemon))
    .concat(moves(data.moves))
    .concat(families(data.families))
    .concat(multipliers(data.cpMultipliers))
}

function types (meta) {
  meta._id = 'TYPES'
  return meta
}

function pokemon (list) {
  return list.map(pokemon => {
    pokemon._id = pokemon.id
    delete pokemon.id
    pokemon.family = pokemon.family.id
    if (pokemon.previousEvolution) {
      pokemon.previousEvolution = pokemon.previousEvolution.id
    }
    if (pokemon.nextEvolutions) {
      pokemon.nextEvolutions = pokemon.nextEvolutions.map(evolution => {
        const pokemon = evolution.pokemon.id
        const { candy, item } = evolution
        return { pokemon, candy, item }
      })
    }
    if (pokemon.quickMoves) {
      pokemon.quickMoves = pokemon.quickMoves.map(move => {
        return { id: move.id, legacy: move.legacy }
      })
    }
    if (pokemon.chargeMoves) {
      pokemon.chargeMoves = pokemon.chargeMoves.map(move => {
        return { id: move.id, legacy: move.legacy }
      })
    }
    if (pokemon.forms) {
      pokemon.forms = pokemon.forms.reduce(function (acc, form) {
        acc[form.form] = form.pokemon
        return acc
      }, Object.create(null))
    }
    return pokemon
  })
}

function moves (list) {
  return list.map(move => {
    move._id = move.id
    delete move.id
    return move
  })
}

function families (list) {
  return list.map(family => {
    family._id = family.id
    delete family.id
    return family
  })
}

function multipliers (list) {
  return {
    _id: 'CP_MULTIPLIERS',
    levels: list.reduce((o, item) => {
      o[item.level] = item.multiplier
      return o
    }, {})
  }
}