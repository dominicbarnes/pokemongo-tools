import Vue from 'vue'
import clone from 'clone'

import { index } from './utils'

const { hoodie } = window

const namespaced = true

const state = {
  list: []
}

const getters = {
  all (state, getters, rootState, rootGetters) {
    const { list } = state
    const { pokemonByID, movesByID } = rootGetters
    return list.map(doc => join(doc, pokemonByID, movesByID))
  },
  byID (state, getters, rootState, rootGetters) {
    const { list } = state
    const { pokemonByID, movesByID } = rootGetters
    const m = index(list, '_id')
    return id => join(m.get(id), pokemonByID, movesByID)
  },
  count ({ list }) {
    return list.length
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

function join (pokemon, pokemonByID, movesByID) {
  if (!pokemon) return null
  const p = clone(pokemon)
  p.metadata = pokemonByID(p.pokemonID)
  if (p.quickMove) {
    const m = clone(movesByID(p.quickMove))
    m.legacy = isLegacyMove(m.id, p.metadata.quickMoves)
    p.quickMove = m
  }
  if (p.chargeMove) {
    const m = clone(movesByID(p.chargeMove))
    m.legacy = isLegacyMove(m.id, p.metadata.chargeMoves)
    p.chargeMove = m
  }
  return p
}

function isLegacyMove (moveID, availableMoves) {
  const metadata = availableMoves.find(move => move.id === moveID)
  if (!metadata) return false
  return !!metadata.legacy
}
