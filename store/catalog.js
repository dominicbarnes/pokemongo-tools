
import clone from 'clone'
import debounce from 'debounce'
import sift from 'sift'
import sortBy from 'sort-by'
import Vue from 'vue'

import pokemon from './pokemon.js'
import { index } from './utils.js'

const state = {
  search: '',
  filterBy: {},
  sortBy: 'recent'
}

const sorters = {
  recent: {
    name: 'Recent',
    fn: sortBy('-caughtAt', '-addedAt', sortMapper)
  },
  dex: {
    name: 'Pokédex Number',
    fn: sortBy('dex', '-cp', sortMapper)
  },
  name: {
    name: 'Name',
    fn: sortBy('name', '-cp', sortMapper)
  },
  cp: {
    name: 'Combat Power',
    fn: sortBy('-cp', sortMapper)
  },
  ivs: {
    name: 'Individual Values',
    fn: sortBy('-totalIV', '-cp', '-addedAt', sortMapper)
  },
  level: {
    name: 'Pokémon Level',
    fn: sortBy('-level', '-cp', sortMapper)
  }
}

const getters = {
  pokemon (state, getters, { hoodie }, rootGetters) {
    const { raw } = hoodie.store
    if (!raw) return []
    return raw.filter(doc => doc.type === 'pokemon').map(doc => pokemon(doc, rootGetters))
  },
  pokemonByID (state, { pokemon }) {
    const m = index(pokemon, 'id')
    return id => m.get(id)
  },
  pokemonCount (state, { pokemon }) {
    return pokemon.length
  },
  filterer (state) {
    const { search, filterBy } = state

    const $and = []
    if (search) {
      const re = new RegExp(search, 'i')
      $and.push({ $or: [ { name: re }, { species: re }, { notes: re } ] })
    }
    if (filterBy) {
      Object.keys(filterBy).map(key => filterBy[key].value).forEach(f => $and.push(f))
    }

    return $and.length ? sift({ $and }) : null
  },
  isFiltered ({ filterBy }) {
    return !!filterBy && Object.keys(filterBy).length > 0
  },
  sorter ({ sortBy }) {
    if (sortBy in sorters) return sorters[sortBy].fn

    console.warn('catalog: unrecognized sort by', sortBy)
    return null
  },
  sortOptions () {
    return Object.keys(sorters).map(key => {
      return {
        value: key,
        text: sorters[key].name
      }
    })
  },

  lists (state, getters, { hoodie }) {
    const { raw } = hoodie.store
    if (!raw) return []
    return raw.filter(doc => doc.type === 'list')
  }
}

const mutations = {
  showList (state, list) {
    Vue.set(state, 'list', list)
    Vue.set(state, 'filterBy', clone(list.filters))
  },

  search (state, search) {
    Vue.set(state, 'search', search)
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

  sortBy (state, by) {
    Vue.set(state, 'sortBy', by)
  }
}

const actions = {
  async pokemonAdd ({ dispatch }, { pokemon }) {
    const doc = Object.assign({ type: 'pokemon' }, pokemon)
    dispatch('hoodie/store/add', doc, { root: true })
  },
  async pokemonUpdate ({ dispatch }, { pokemon }) {
    dispatch('hoodie/store/update', pokemon, { root: true })
  },
  async pokemonRemove ({ dispatch }, { pokemon }) {
    dispatch('hoodie/store/remove', pokemon, { root: true })
  },

  listShow ({ commit }, { list }) {
    commit('showList', list)
  },
  async listAdd ({ commit, dispatch, state }, { list }) {
    const doc = await dispatch('hoodie/store/add', {
      name: list,
      filters: state.filterBy,
      type: 'list'
    }, { root: true })
    commit('showList', doc)
  },
  async listUpdate ({ dispatch }, { list }) {
    await dispatch('hoodie/store/update', list, { root: true })
  },
  async listRemove ({ commit, dispatch }, { list }) {
    commit('removeAllFilters')
    await dispatch('hoodie/store/remove', list, { root: true })
  },

  search: debounce(({ commit }, search) => {
    commit('search', search)
  }, 250),
  addFilter ({ commit }, { id, value, label }) {
    commit('addFilter', { id, value, label })
  },
  removeFilter ({ commit }, id) {
    commit('removeFilter', id)
  },
  removeAllFilters ({ commit }) {
    commit('removeAllFilters')
  },

  sort ({ commit }, sortBy) {
    commit('sortBy', sortBy)
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
