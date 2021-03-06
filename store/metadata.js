import camel from 'camelcase'
import clone from 'clone'
import PouchDB from 'pouchdb-browser'
import sortBy from 'sort-by'
import Store from '@hoodie/store-client'
import Vue from 'vue'

import { metadataURL as remote } from '../config.js'
import { index } from './utils.js'
import { cp, hp } from '../utils.js'

const store = new Store('pokemongo-metadata', { PouchDB, remote })

const state = {
  types: {},
  cpMultipliers: {},
  upgradeCosts: {},
  pokemon: [],
  moves: [],
  families: [],
  loading: true
}

const getters = {
  ready ({ loading }) {
    return !loading
  },

  pokemonByDex ({ pokemon }) {
    const m = index(pokemon, 'dex')
    return id => m.get(id)
  },
  pokemonByID ({ pokemon }) {
    const m = index(pokemon, '_id')
    return (id, form) => {
      if (!m.has(id)) return null
      if (form) {
        const o = clone(m.get(id))
        Object.assign(o, o.forms[form])
        delete o.forms
        return o
      } else {
        return m.get(id)
      }
    }
  },
  pokemonSort ({ pokemon }) {
    return keys => pokemon.slice().sort(sortBy.apply(null, toArray(keys)))
  },
  pokemonCount ({ pokemon }) {
    return pokemon.length
  },
  pokemonGenerations ({ pokemon }) {
    return Array.from(pokemon.reduce((acc, doc) => {
      acc.add(doc.generation)
      return acc
    }, new Set())).sort()
  },
  pokemonThatEvolve ({ pokemon }) {
    return pokemon
      .filter(doc => doc.nextEvolutions && doc.nextEvolutions.length)
      .map(doc => doc._id)
  },

  movesByID ({ moves }) {
    const m = index(moves, '_id')
    return (id, hptype) => {
      const move = clone(m.get(id))
      if (move && move._id === 'MOVE_HIDDEN_POWER_FAST' && hptype) move.type = hptype
      return move
    }
  },
  quickMoves ({ moves }) {
    return moves.filter(move => move._id.endsWith('_FAST')).slice()
  },
  chargeMoves ({ moves }) {
    return moves.filter(move => !move._id.endsWith('_FAST')).slice()
  },
  allMoves ({ moves }) {
    return moves.slice()
  },

  familyByID ({ families }) {
    const m = index(families, '_id')
    return id => m.get(id)
  },

  cpMultipliers ({ cpMultipliers }) {
    return level => {
      if (!cpMultipliers.levels) return null
      return cpMultipliers.levels[level]
    }
  },
  levels ({ cpMultipliers }) {
    if (!cpMultipliers.levels) return null
    return Object.keys(cpMultipliers.levels)
      .map(key => parseFloat(key))
      .sort((a, b) => a - b)
  },
  level ({ cpMultipliers }) {
    return input => {
      let xdelta = Infinity
      let xlevel = 0
      for (const level in cpMultipliers.levels) {
        const multiplier = cpMultipliers.levels[level]
        const delta = Math.abs(input - multiplier)
        if (delta < xdelta) {
          xdelta = delta
          xlevel = level
        }
      }
      return parseFloat(xlevel)
    }
  },
  maxPossibleCP ({ pokemon }, { cpMultipliers }) {
    const multiplier = cpMultipliers(40)
    const cps = pokemon.map(doc => {
      const attack = doc.baseStats.attack + 15
      const defense = doc.baseStats.defense + 15
      const stamina = doc.baseStats.defense + 15
      return cp(attack, defense, stamina, multiplier)
    })
    return Math.max(...cps)
  },
  maxPossibleHP ({ pokemon }, { cpMultipliers }) {
    const multiplier = cpMultipliers(40)
    const hps = pokemon.map(doc => {
      const stamina = doc.baseStats.defense + 15
      return hp(stamina, multiplier)
    })
    return Math.max(...hps)
  },

  upgradeCosts ({ upgradeCosts }) {
    return level => {
      if (!upgradeCosts.levels) return null
      return upgradeCosts.levels[level]
    }
  },
  possibleLevelsForStardust ({ upgradeCosts }) {
    const { levels } = upgradeCosts
    return input => {
      if (!levels) return null
      return Object.keys(levels)
        .filter(key => levels[key].stardust === input)
        .map(key => parseFloat(key))
    }
  },
  stardustTiers ({ upgradeCosts }) {
    const { levels } = upgradeCosts
    if (!levels) return []
    return Array.from(new Set(Object.keys(levels).map(key => levels[key].stardust)))
  },

  types ({ types }) {
    if (!types.list) return null
    return types.list.slice().sort()
  },
  attackerTypes ({ types }) {
    if (!types) return null

    const { list, matrix } = types
    if (!list || !matrix) return null

    return list.reduce((acc, t1, i1) => {
      acc[t1] = list.reduce((acc, t2, i2) => {
        acc[t2] = matrix[i1][i2]
        return acc
      }, {})
      return acc
    }, {})
  },
  defenderTypes ({ types }) {
    if (!types) return null

    const { list, matrix } = types
    if (!list || !matrix) return null

    return list.reduce((acc, t1, i1) => {
      acc[t1] = list.reduce((acc, t2, i2) => {
        acc[t2] = matrix[i2][i1]
        return acc
      }, {})
      return acc
    }, {})
  }
}

const mutations = {
  loaded () {
    if (state.loading) {
      Vue.set(state, 'loading', false)
    }
  },
  metadata (state, docs) {
    const pokemon = []
    const moves = []
    const families = []
    docs.forEach(doc => {
      if (doc._id.startsWith('POKEMON_')) {
        pokemon.push(doc)
      } else if (doc._id.startsWith('MOVE_')) {
        moves.push(doc)
      } else if (doc._id.startsWith('FAMILY_')) {
        families.push(doc)
      } else {
        Vue.set(state, camel(doc._id), doc)
      }
    })
    Vue.set(state, 'pokemon', pokemon)
    Vue.set(state, 'moves', moves)
    Vue.set(state, 'families', families)
  }
}

const actions = {
  async init ({ commit, dispatch }) {
    try {
      commit('metadata', await store.findAll())
      commit('loaded')
    } catch (err) {
      console.warn('metadata not found in local cache', err)
    }

    await dispatch('pull')
    commit('loaded')

    setInterval(() => dispatch('pull'), 60000)
  },

  async pull ({ commit }) {
    const pulled = await store.pull()
    if (!pulled.length) return
    commit('metadata', await store.findAll())
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

function toArray (input) {
  return Array.isArray(input) ? input : [input]
}
