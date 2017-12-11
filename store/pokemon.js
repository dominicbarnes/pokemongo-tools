import Vue from 'vue'
import sortBy from 'sort-by'

const { hoodie } = window

const namespaced = true

const state = {
  list: []
}

const getters = {
  recent ({ list }) {
    return list.slice().sort(sortBy('hoodie.createdAt')).reverse()
  },
  byID ({ list }) {
    return list.reduce((acc, pokemon) => {
      acc[pokemon._id] = pokemon
      return acc
    }, Object.create(null))
  }
}

const mutations = {
  set: (state, doc) => {
    Vue.set(state, 'list', doc)
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

  async update ({ commit }, { id, changes }) {
    await hoodie.store.update(id, changes)
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
