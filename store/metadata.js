import config from '../config'
import PouchDB from 'pouchdb'
import Store from '@hoodie/store-client'
import Vue from 'vue'

const store = new Store('pokemongo-metadata', {
  PouchDB: PouchDB,
  remote: config.metadataURL()
})

const namespaced = true

const state = {
  types: {},
  pokemon: [],
  moves: [],
  loading: true
}

const getters = {
  pokemonByDex ({ pokemon }) {
    return pokemon.reduce((acc, pokemon) => {
      acc[pokemon.dex] = pokemon
      return acc
    }, Object.create(null))
  },

  pokemonByID ({ pokemon }) {
    return pokemon.reduce((acc, pokemon) => {
      acc[pokemon._id] = pokemon
      return acc
    }, Object.create(null))
  },

  movesByID ({ moves }) {
    return moves.reduce((acc, move) => {
      acc[move._id] = move
      return acc
    }, Object.create(null))
  },

  quickMoves ({ moves }) {
    return moves.filter(move => move._id.endsWith('_FAST'))
  },

  chargeMoves ({ moves }) {
    return moves.filter(move => !move._id.endsWith('_FAST'))
  }
}

const mutations = {
  loaded: () => Vue.set(state, 'loading', false),
  types: (state, types) => Vue.set(state, 'types', types),
  pokemon: (state, pokemon) => Vue.set(state, 'pokemon', pokemon),
  moves: (state, moves) => Vue.set(state, 'moves', moves)
}

const actions = {
  async fetch ({ commit }) {
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
  namespaced,
  state,
  getters,
  mutations,
  actions
}
