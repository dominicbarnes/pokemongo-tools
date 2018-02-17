import Vue from 'vue'

import { index } from './utils'

const { hoodie } = window

const namespaced = true

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
  async fetch ({ commit }) {
    commit('set', await hoodie.store.findAll(doc => doc.type === 'pokemon'))
  },
  async add ({ commit }, doc) {
    const input = Object.assign({ type: 'pokemon' }, doc)
    await hoodie.store.add(input)
  },
  async update ({ commit }, doc) {
    await hoodie.store.update(doc._id, doc)
  },
  async remove ({ commit }, id) {
    await hoodie.store.remove(id)
  }
}

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions
}
