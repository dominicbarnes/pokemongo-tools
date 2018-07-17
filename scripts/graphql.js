
const flatten = require('array-flatten')
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
  upgradeCosts {
    level
    candy
    stardust
  }
}`

exports.import = async function () {
  return docs(await client.request(query))
}

function docs (data) {
  return []
    .concat(types(data.types))
    .concat(pokemon(data.pokemon))
    .concat(moves(data.moves, data.types.list))
    .concat(families(data.families))
    .concat(multipliers(data.cpMultipliers))
    .concat(upgradeCosts(data.upgradeCosts))
}

function types (meta) {
  meta._id = 'TYPES'
  return meta
}

function pokemon (list) {
  return list.map(poke)
}

function poke (doc) {
  doc._id = doc.id
  delete doc.id
  doc.family = doc.family.id
  if (doc.previousEvolution) {
    doc.previousEvolution = doc.previousEvolution.id
  }
  if (doc.nextEvolutions) {
    doc.nextEvolutions = doc.nextEvolutions.map(evolution => {
      const pokemon = evolution.pokemon.id
      const { candy, item } = evolution
      return { pokemon, candy, item }
    })
  }
  if (doc.quickMoves) {
    doc.quickMoves = doc.quickMoves.map(move => {
      return { id: move.id, legacy: move.legacy }
    })
  }
  if (doc.chargeMoves) {
    doc.chargeMoves = doc.chargeMoves.map(move => {
      return { id: move.id, legacy: move.legacy }
    })
  }
  if (doc.forms) {
    doc.forms = doc.forms.reduce(function (acc, form) {
      acc[form.form] = poke(form.pokemon)
      return acc
    }, Object.create(null))
  }
  return doc
}

function moves (list, types) {
  return flatten(list.map(move => {
    if (move.id === 'MOVE_HIDDEN_POWER_FAST') {
      return types.map(type => {
        return {
          _id: `MOVE_HIDDEN_POWER_${type.toUpperCase()}_FAST`,
          name: move.name,
          type: type,
          power: move.power
        }
      })
    } else {
      return {
        _id: move.id,
        name: move.name,
        type: move.type,
        power: move.power || 0
      }
    }
  }))
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

function upgradeCosts (list) {
  return {
    _id: 'UPGRADE_COSTS',
    levels: list.reduce((o, item) => {
      o[item.level] = {
        candy: item.candy,
        stardust: item.stardust
      }
      return o
    }, {})
  }
}
