import PouchDB from 'pouchdb-browser'
import sortBy from 'sort-by'
import Store from '@hoodie/store-client'
import Vue from 'vue'

import config from '../config'
import { index } from './utils'

const store = new Store('pokemongo-metadata', {
  PouchDB: PouchDB,
  remote: config.metadataURL()
})

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
      const o = m.get(id)
      if (!o) return null
      return form ? o.forms[form] : o
    }
  },
  pokemonSort ({ pokemon }) {
    return key => pokemon.slice().sort(sortBy(key))
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

  movesByID ({ moves }) {
    const m = index(moves, '_id')
    return id => m.get(id)
  },
  quickMoves ({ moves }) {
    return moves.filter(move => move._id.endsWith('_FAST')).slice()
  },
  chargeMoves ({ moves }) {
    return moves.filter(move => !move._id.endsWith('_FAST')).slice()
  },

  cpMultipliers ({ cpMultipliers }) {
    return level => {
      if (!cpMultipliers.levels) return null
      return cpMultipliers.levels[level]
    }
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

  upgradeCosts ({ upgradeCosts }) {
    return level => {
      if (!upgradeCosts.levels) return null
      return upgradeCosts.levels[level]
    }
  }
}

const mutations = {
  loaded: () => Vue.set(state, 'loading', false),
  types: (state, types) => Vue.set(state, 'types', types),
  cpMultipliers: (state, cpMultipliers) => Vue.set(state, 'cpMultipliers', cpMultipliers),
  upgradeCosts: (state, upgradeCosts) => Vue.set(state, 'upgradeCosts', upgradeCosts),
  pokemon: (state, pokemon) => Vue.set(state, 'pokemon', pokemon),
  moves: (state, moves) => Vue.set(state, 'moves', moves),
  families: (state, families) => Vue.set(state, 'families', families)
}

const actions = {
  async init ({ commit, state }) {
    try {
      commit('types', await store.find('TYPES'))
      commit('cpMultipliers', await store.find('CP_MULTIPLIERS'))
      commit('upgradeCosts', await store.find('UPGRADE_COSTS'))
      commit('pokemon', await store.withIdPrefix('POKEMON_').findAll())
      commit('moves', await store.withIdPrefix('MOVE_').findAll())
      commit('families', await store.withIdPrefix('FAMILY_').findAll())
      commit('loaded')
    } catch (err) {
      console.warn('metadata not found in local cache')
    }

    await store.pull()
    commit('types', await store.find('TYPES'))
    commit('cpMultipliers', await store.find('CP_MULTIPLIERS'))
    commit('upgradeCosts', await store.find('UPGRADE_COSTS'))
    commit('pokemon', await store.withIdPrefix('POKEMON_').findAll())
    commit('moves', await store.withIdPrefix('MOVE_').findAll())
    commit('families', await store.withIdPrefix('FAMILY_').findAll())
    commit('loaded')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
