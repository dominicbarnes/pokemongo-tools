
import debounce from 'debounce'
import moment from 'moment'
import numeral from 'numeral'
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
      const species = pokemonByID(catalog.pokemonID)
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
        form: catalog.form || 'normal',
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
        quickMove: catalog && movesByID(catalog.quickMove, catalog.hiddenPowerType),
        rarity: metadata && metadata.rarity,
        shiny: !!catalog.shiny,
        sprite: spriteURL(metadata, catalog),
        species: species && species.name,
        staminaIV: staminaIV,
        types: metadata && metadata.types,
        uncertain: !!catalog.uncertainStats,
        updated: hoodie.updatedAt && moment(hoodie.updatedAt).toDate()
      }
    })
  },
  filterer (state) {
    if (!state.filterBy) return null

    const { name, family, generation, minIV, minLevel, types, evolves, rarity, quickMove, chargeMove, form, shiny, uncertain } = state.filterBy
    const query = { $and: [] }

    if (name) {
      const re = new RegExp(name, 'i')
      query.$and.push({ $or: [ { name: re }, { species: re }, { notes: re } ] })
    }

    if (family) query.$and.push({ family })
    if (generation) query.$and.push({ generation })
    if (minIV) query.$and.push({ ivp: { $gte: minIV / 100 } })
    if (minLevel) query.$and.push({ level: { $gte: minLevel } })
    if (rarity) query.$and.push({ rarity: rarity === 'common' ? null : rarity })
    if (types && types.length) query.$and.push({ types: { $all: types.slice() } })
    if (quickMove) query.$and.push({ 'quickMove._id': quickMove })
    if (chargeMove) query.$and.push({ 'chargeMove._id': chargeMove })
    if (form) query.$and.push({ form })
    if (typeof shiny === 'boolean') query.$and.push({ shiny })
    if (typeof uncertain === 'boolean') query.$and.push({ uncertain })
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
      case 'ivs': return sortBy('-ivs', '-cp', '-added', sortMapper)
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
  changes ({ raw }, changes) {
    changes.forEach(change => {
      const { kind, doc } = change

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
    })
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

    const changes = []
    const flush = debounce(() => {
      commit('changes', changes)
      changes.splice(0, changes.length)
    }, 500)

    hoodie.store.on('change', (kind, doc) => {
      if (doc.type !== 'pokemon') return

      changes.push({ kind, doc })
      flush()
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

function nextEvolutions (list) {
  if (!list) return []
  return list.map(evolution => {
    return {
      pokemon: evolution.pokemon,
      item: evolution.item,
      candy: evolution.candy
    }
  })
}

function spriteURL (metadata, catalog) {
  if (!metadata || !catalog) return null
  const bundle = metadata.assetBundleValue || 0
  let basename = `pokemon_icon_${numeral(metadata.dex).format('000')}_${numeral(bundle).format('00')}`
  if (catalog.shiny) basename += '_shiny'
  return `https://raw.githubusercontent.com/ZeChrales/PogoAssets/master/decrypted_assets/${basename}.png`
}

// this helper function will only be necessary until kvnneff/sort-by#10 lands
// @see https://github.com/kvnneff/sort-by/pull/10
function sortMapper (key, value) {
  return value.valueOf()
}
