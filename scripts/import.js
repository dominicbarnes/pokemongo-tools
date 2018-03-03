
const fs = require('fs')
const { GraphQLClient } = require('graphql-request')
const mkdir = require('mkdirp')
const path = require('path')

const graphql = new GraphQLClient('https://61heu9qv1g.execute-api.us-west-2.amazonaws.com/production/graphql', {
  headers: {
    Accept: 'application/json'
  }
})
const base = path.resolve(__dirname, '../_couchdb/pokemongo-metadata')

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
}`

main().catch(err => console.error(err))

async function main () {
  const data = await graphql.request(query)
  await mkdir(base)
  for (const doc of docs(data)) {
    fs.writeFileSync(path.resolve(base, `${doc._id}.json`), JSON.stringify(doc, null, 2))
  }
}

function docs (data) {
  return []
    .concat(types(data.types))
    .concat(pokemon(data.pokemon))
    .concat(moves(data.moves))
    .concat(families(data.families))
}

function types (meta) {
  meta._id = 'TYPES'
  return meta
}

function pokemon (list) {
  return list.map(pokemon => {
    pokemon._id = pokemon.id
    delete pokemon.id
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
