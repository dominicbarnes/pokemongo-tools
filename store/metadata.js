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
  }
}

const mutations = {
  loaded: () => Vue.set(state, 'loading', false),
  types: (state, types) => Vue.set(state, 'types', types),
  pokemon: (state, pokemon) => Vue.set(state, 'pokemon', pokemon)
}

const actions = {
  async fetch ({ commit }) {
    try {
      commit('types', await store.find('TYPES'))
      commit('pokemon', await store.withIdPrefix('POKEMON_').findAll())
    } catch (err) {
      console.warn('metadata not found in local cache')
    }

    await store.pull()
    commit('loaded')
    commit('types', await store.find('TYPES'))
    commit('pokemon', await store.withIdPrefix('POKEMON_').findAll())
  }
}

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions
}
