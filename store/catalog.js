
import moment from 'moment'
import sift from 'sift'
import sortBy from 'sort-by'
import Vue from 'vue'

import { index } from './utils'
import { cp, hp } from '../utils.js'

const { hoodie } = window

const state = {
  raw: [],
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
  all ({ raw }, getters, { loading }, { pokemonByID, movesByID, cpMultipliers }) {
    if (loading) return []
    return raw.map(catalog => {
      const metadata = pokemonByID(catalog.pokemonID, catalog.form)
      const { hoodie, attackIV = 0, defenseIV = 0, staminaIV = 0 } = catalog
      const ivs = attackIV + defenseIV + staminaIV
      const multiplier = cpMultipliers(catalog.level)
      return {
        added: hoodie.createdAt && moment(hoodie.createdAt).toDate(),
        attackIV: attackIV,
        caught: catalog.caughtAt && moment(catalog.caughtAt).toDate(),
        chargeMove: catalog && movesByID(catalog.chargeMove),
        cp: calculateCP(catalog, metadata, multiplier),
        defenseIV: defenseIV,
        dex: metadata && metadata.dex,
        nextEvolutions: metadata && nextEvolutions(metadata.nextEvolutions),
        id: catalog._id,
        family: metadata && metadata.family,
        form: catalog.form,
        generation: metadata && metadata.generation,
        hp: calculateHP(catalog, metadata, multiplier),
        ivs: ivs,
        ivp: ivs / 45,
        level: catalog.level,
        name: catalog.nickname || (metadata && metadata.name),
        nickname: catalog.nickname,
        notes: catalog.notes,
        pokemon: catalog.pokemonID,
        prevEvolution: metadata && pokemonByID(metadata.prevEvolution),
        quickMove: catalog && movesByID(catalog.quickMove),
        rarity: metadata && metadata.rarity,
        shiny: !!catalog.shiny,
        species: metadata && metadata.name,
        staminaIV: staminaIV,
        types: metadata && metadata.types,
        updated: hoodie.updatedAt && moment(hoodie.updatedAt).toDate()
      }
    })
  },
  filterer (state) {
    const { name, family, generation, minIV, minLevel, types, evolves, rarity, quickMove, chargeMove } = state.filterBy
    const query = { $and: [] }

    if (name) {
      const re = new RegExp(name, 'i')
      query.$and.push({ $or: [ { name: re }, { species: re } ] })
    }

    if (family) query.$and.push({ family })
    if (generation) query.$and.push({ generation })
    if (minIV) query.$and.push({ ivp: { $gte: minIV / 100 } })
    if (minLevel) query.$and.push({ level: { $gte: minLevel } })
    if (rarity) query.$and.push({ rarity: rarity === 'common' ? null : rarity })
    if (types && types.length) query.$and.push({ types: { $all: types.slice() } })
    if (quickMove) query.$and.push({ 'quickMove._id': quickMove })
    if (chargeMove) query.$and.push({ 'chargeMove._id': chargeMove })
    if (typeof evolves === 'boolean') {
      query.$and.push({
        pokemon: { [evolves ? '$in' : '$nin']: this.evolves }
      })
    }

    return sift(query)
  },
  sorter (state) {
    switch (state.sortBy) {
      case 'recent': return sortBy('-caught', '-added', sortMapper)
      case 'dex': return sortBy('dex', '-cp', sortMapper)
      case 'name': return sortBy('name', '-cp', sortMapper)
      case 'cp': return sortBy('-cp', sortMapper)
      case 'ivs': return sortBy('-ivs', '-added', sortMapper)
      case 'level': return sortBy('-level', '-cp', sortMapper)
      default:
        console.warn('catalog: unrecognized sort by', state.sortBy)
        return null
    }
  },
  list (state, { all, filterer, sorter }) {
    let list = all.slice()
    if (filterer) list = list.filter(filterer)
    if (sorter) list.sort(sorter)
    return list
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
  reset ({ raw }) {
    raw.splice(0, raw.length)
  },
  filter (state, filter) {
    Vue.set(state, 'filterBy', filter)
  },
  sorter (state, sorter) {
    Vue.set(state, 'sortBy', sorter)
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
  },

  filter ({ commit }, filter) {
    commit('filter', filter)
  },
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

function calculateCP (catalog, metadata, multiplier) {
  if (!catalog || !metadata) return 0
  const attack = metadata.baseStats.attack + catalog.attackIV
  const defense = metadata.baseStats.defense + catalog.defenseIV
  const stamina = metadata.baseStats.stamina + catalog.staminaIV
  return cp(attack, defense, stamina, multiplier)
}

function calculateHP (catalog, metadata, multiplier) {
  if (!catalog || !metadata) return 0
  const stamina = metadata.baseStats.stamina + catalog.staminaIV
  return hp(stamina, multiplier)
}

function nextEvolutions ({ pokemonByID, itemsByID }, list) {
  if (!list) return []
  return list.map(evolution => {
    return {
      pokemon: pokemonByID(evolution.pokemon),
      item: itemsByID(evolution.item),
      candy: evolution.candy
    }
  })
}

// this helper function will only be necessary until kvnneff/sort-by#10 lands
// @see https://github.com/kvnneff/sort-by/pull/10
function sortMapper (key, value) {
  return value.valueOf()
}
