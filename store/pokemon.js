import Vue from 'vue'

import { index } from './utils'

const { hoodie } = window

const state = {
  list: []
}

const getters = {
  all (state) {
    return state.list
  },
  byID (state) {
    const { list } = state
    const m = index(list, '_id')
    return id => m.get(id)
  },
  count (state) {
    return state.list.length
  }
}

const mutations = {
  set: (state, list) => {
    Vue.set(state, 'list', list)
  },
  add: ({ list }, doc) => {
    list.push(doc)
  },
  update: ({ list }, doc) => {
    const x = list.findIndex(p => p._id === doc._id)
    Vue.set(list, x, doc)
  },
  remove: ({ list }, id) => {
    const x = list.findIndex(item => item._id === id)
    list.splice(x, 1)
  },
  reset: ({ list }) => {
    list.splice(0, list.length)
  }
}

const actions = {
  async init ({ commit }) {
    commit('set', await hoodie.store.findAll(doc => doc.type === 'pokemon'))

    hoodie.store.on('reset', () => commit('reset'))

    hoodie.store.on('change', (kind, doc) => {
      if (doc.type !== 'pokemon') return

      if (kind === 'add' || kind === 'update') {
        commit(kind, doc)
      } else if (kind === 'remove') {
        commit(kind, doc._id)
      }
    })
  },
  async add ({ commit }, { pokemon, trigger }) {
    const input = Object.assign({ type: 'pokemon' }, pokemon)
    await hoodie.store.add(input)
    window.analytics.track('Added Pokémon', { pokemon, trigger })
  },
  async update ({ commit }, { pokemon, trigger }) {
    await hoodie.store.update(pokemon._id, pokemon)
    window.analytics.track('Updated Pokémon', { pokemon, trigger })
  },
  async remove ({ commit }, { pokemon, trigger }) {
    await hoodie.store.remove(pokemon)
    window.analytics.track('Removed Pokémon', { pokemon })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}