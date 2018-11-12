
import clone from 'clone'
import debounce from 'debounce'
import sift from 'sift'
import sortBy from 'sort-by'
import Vue from 'vue'

import pokemon from './pokemon.js'
import { index } from './utils'

const { hoodie } = window

const state = {
  raw: [],
  lists: [],
  list: null,
  search: '',
  filterBy: {},
  sortBy: 'recent'
}

const getters = {
  byID (state, { all }) {
    const m = index(all, 'id')
    return id => m.get(id)
  },
  rawByID ({ raw }) {
    const m = index(raw, '_id')
    return id => m.get(id)
  },
  all ({ raw }, getters, { loading }, state) {
    if (loading) return []
    return raw.map(catalog => pokemon(catalog, state))
  },
  filterer (state, getters, rootState, { pokemonThatEvolve }) {
    const { search, filterBy } = state

    const $and = []
    if (search) {
      const re = new RegExp(search, 'i')
      $and.push({ $or: [ { name: re }, { species: re }, { notes: re } ] })
    }
    Object.keys(filterBy).map(key => filterBy[key].value).forEach(f => $and.push(f))

    return $and.length ? sift({ $and }) : null
  },
  presetLists () {
    return [
      {
        _id: 'preset-wonder',
        name: 'Wonder / Class S',
        filters: {
          ivs: {
            label: '100% IVs',
            value: { percentIV: 1 }
          }
        }
      },
      {
        _id: 'preset-shinies',
        name: 'Shinies',
        filters: {
          ivs: {
            label: 'Shiny',
            value: { shiny: true }
          }
        }
      },
      {
        _id: 'preset-luckies',
        name: 'Luckies',
        filters: {
          ivs: {
            label: 'Lucky',
            value: { lucky: true }
          }
        }
      }
    ]
  },
  listsByID ({ lists }, { presetLists }) {
    const m = index(lists.concat(presetLists), '_id')
    return id => m.get(id)
  },
  isFiltered ({ filterBy }) {
    return Object.keys(filterBy).length > 0
  },
  sorter (state) {
    switch (state.sortBy) {
      case 'recent': return sortBy('-caughtAt', '-addedAt', sortMapper)
      case 'dex': return sortBy('dex', '-cp', sortMapper)
      case 'name': return sortBy('name', '-cp', sortMapper)
      case 'cp': return sortBy('-cp', sortMapper)
      case 'ivs': return sortBy('-totalIV', '-cp', '-addedAt', sortMapper)
      case 'level': return sortBy('-level', '-cp', sortMapper)
      default:
        console.warn('catalog: unrecognized sort by', state.sortBy)
        return null
    }
  },
  totalCount ({ raw }) {
    return raw.length
  },
  sortOptions () {
    return [
      { value: 'recent', text: 'Recent' },
      { value: 'dex', text: 'Pokédex Number' },
      { value: 'name', text: 'Name' },
      { value: 'cp', text: 'Combat Power' },
      { value: 'ivs', text: 'Individual Values (IVs)' },
      { value: 'level', text: 'Pokémon Level' }
    ]
  }
}

const mutations = {
  set (state, raw) {
    Vue.set(state, 'raw', raw)
  },
  add ({ raw }, doc) {
    raw.push(doc)
  },
  update ({ raw }, doc) {
    const x = raw.findIndex(item => item._id === doc._id)
    Vue.set(raw, x, doc)
  },
  remove ({ raw }, id) {
    const x = raw.findIndex(item => item._id === id)
    raw.splice(x, 1)
  },
  lists (state, lists) {
    Vue.set(state, 'lists', lists)
  },
  addList ({ lists }, doc) {
    lists.push(doc)
  },
  updateList ({ lists }, doc) {
    const x = lists.findIndex(item => item._id === doc._id)
    Vue.set(lists, x, doc)
  },
  removeList ({ lists }, id) {
    const x = lists.findIndex(item => item._id === id)
    lists.splice(x, 1)
  },
  changes ({ raw, lists }, changes) {
    changes.forEach(change => {
      const { kind, doc } = change

      if (doc.type === 'pokemon') {
        switch (kind) {
          case 'add':
            raw.push(doc)
            break
          case 'update':
            Vue.set(raw, raw.findIndex(item => item._id === doc._id), doc)
            break
          case 'remove':
            raw.splice(raw.findIndex(item => item._id === doc._id), 1)
            break
        }
      } else if (doc.type === 'list') {
        switch (kind) {
          case 'add':
            lists.push(doc)
            break
          case 'update':
            Vue.set(lists, lists.findIndex(item => item._id === doc._id), doc)
            break
          case 'remove':
            lists.splice(lists.findIndex(item => item._id === doc._id), 1)
            break
        }
      }
    })
  },
  reset ({ raw }) {
    raw.splice(0, raw.length)
  },
  addFilter ({ filterBy }, { id, value, label }) {
    Vue.delete(state, 'list')
    Vue.set(filterBy, id, { value, label })
  },
  removeFilter ({ filterBy }, id) {
    Vue.delete(state, 'list')
    Vue.delete(filterBy, id)
  },
  removeAllFilters (state) {
    Vue.delete(state, 'list')
    Vue.set(state, 'filterBy', {})
  },
  showList (state, list) {
    Vue.set(state, 'list', list)
    Vue.set(state, 'filterBy', clone(list.filters))
  },
  search (state, search) {
    Vue.set(state, 'search', search)
  },
  sorter (state, sorter) {
    Vue.set(state, 'sortBy', sorter)
  }
}

const actions = {
  async init ({ commit }) {
    commit('set', await hoodie.store.findAll(doc => doc.type === 'pokemon'))
    commit('lists', await hoodie.store.findAll(doc => doc.type === 'list'))

    hoodie.store.on('reset', () => commit('reset'))

    const changes = []
    const flush = debounce(() => {
      commit('changes', changes)
      changes.splice(0, changes.length)
    }, 500)

    hoodie.store.on('change', (kind, doc) => {
      if (doc.type === 'pokemon' || doc.type === 'list') {
        changes.push({ kind, doc })
        flush()
      }
    })
  },
  async add (context, { pokemon, trigger }) {
    const input = Object.assign({ type: 'pokemon' }, pokemon)
    await hoodie.store.add(input)
  },
  async update (context, { pokemon, trigger }) {
    await hoodie.store.update(pokemon._id, pokemon)
  },
  async remove (context, { pokemon }) {
    await hoodie.store.remove(pokemon)
  },

  addFilter ({ commit }, { id, value, label }) {
    commit('addFilter', { id, value, label })
  },
  removeFilter ({ commit }, id) {
    commit('removeFilter', id)
  },
  removeAllFilters ({ commit }) {
    commit('removeAllFilters')
  },

  showList ({ commit, getters }, id) {
    const list = getters.listsByID(id)
    commit('showList', list)
  },
  async saveList ({ commit, state }, name) {
    const doc = await hoodie.store.add({
      name: name,
      filters: state.filterBy,
      type: 'list'
    })
    commit('showList', doc)
  },
  async removeList ({ commit }, id) {
    await hoodie.store.remove(id)
    commit('removeAllFilters')
  },

  search: debounce(({ commit }, search) => {
    commit('search', search)
  }, 250),

  sort ({ commit }, sorter) {
    commit('sorter', sorter)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

// this helper function will only be necessary until kvnneff/sort-by#10 lands
// @see https://github.com/kvnneff/sort-by/pull/10
function sortMapper (key, value) {
  return value && value.valueOf()
}
