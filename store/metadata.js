import PouchDB from 'pouchdb'
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
  pokemon: [],
  moves: [],
  loading: true
}

const getters = {
  pokemonByDex ({ pokemon }) {
    const m = index(pokemon, 'dex')
    return id => m.get(id)
  },
  pokemonByID ({ pokemon }) {
    const m = index(pokemon, '_id')
    return id => m.get(id)
  },
  pokemonSort ({ pokemon }) {
    return key => pokemon.slice().sort(sortBy(key))
  },
  pokemonCount ({ pokemon }) {
    return pokemon.length
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
  }
}

const mutations = {
  loaded: () => Vue.set(state, 'loading', false),
  types: (state, types) => Vue.set(state, 'types', types),
  pokemon: (state, pokemon) => Vue.set(state, 'pokemon', pokemon),
  moves: (state, moves) => Vue.set(state, 'moves', moves)
}

const actions = {
  async fetch ({ commit, state }) {
    try {
      commit('types', await store.find('TYPES'))
      commit('pokemon', await store.withIdPrefix('POKEMON_').findAll())
      commit('moves', await store.withIdPrefix('MOVE_').findAll())
      commit('loaded')
    } catch (err) {
      console.warn('metadata not found in local cache')
    }

    await store.pull()
    commit('types', await store.find('TYPES'))
    commit('pokemon', await store.withIdPrefix('POKEMON_').findAll())
    commit('moves', await store.withIdPrefix('MOVE_').findAll())
    commit('loaded')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
