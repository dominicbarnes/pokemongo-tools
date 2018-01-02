
const fs = require('fs')
const graphql = require('graphql-request')
const mkdir = require('mkdirp')
const path = require('path')

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
    }
    chargeMoves {
      id
    }
    rarity
    maxCP
    buddyDistance
    height
    weight
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
}`

main().catch(err => console.error(err))

async function main () {
  const data = await graphql.request('https://61heu9qv1g.execute-api.us-west-2.amazonaws.com/development/graphql', query)
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
}

function types (meta) {
  meta._id = 'TYPES'
  return meta
}

function pokemon (list) {
  return list.map(pokemon => {
    pokemon._id = `POKEMON_${pokemon.id}`
    delete pokemon.id
    if (pokemon.previousEvolution) {
      pokemon.previousEvolution = `POKEMON_${pokemon.previousEvolution.id}`
    }
    if (pokemon.nextEvolutions) {
      pokemon.nextEvolutions = pokemon.nextEvolutions.map(evolution => {
        const pokemon = `POKEMON_${evolution.pokemon.id}`
        const { candy, item } = evolution
        return { pokemon, candy, item }
      })
    }
    if (pokemon.quickMoves) {
      pokemon.quickMoves = pokemon.quickMoves.map(move => `MOVE_${move.id}`)
    }
    if (pokemon.chargeMoves) {
      pokemon.chargeMoves = pokemon.chargeMoves.map(move => `MOVE_${move.id}`)
    }
    return pokemon
  })
}

function moves (list) {
  return list.map(move => {
    move._id = `MOVE_${move.id}`
    delete move.id
    return move
  })
}
