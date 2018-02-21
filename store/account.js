import Vue from 'vue'
import * as analytics from '../analytics.js'

const { hoodie } = window

const namespaced = true

const state = {
  account: Object.create(null)
}

const getters = {
  loggedIn ({ account }) {
    if (!account) return false
    if (!account.session) return false
    return !!account.id
  },

  username ({ account }, { loggedIn }) {
    return loggedIn ? account.username : null
  }
}

const mutations = {
  account: (state, account) => Vue.set(state, 'account', account)
}

const actions = {
  async fetch ({ commit }) {
    const account = await hoodie.account.get(null, { local: true })
    commit('account', account)
    if (account) analytics.signIn(account.username)
  },

  async signUp ({ commit, dispatch }, { username, password }) {
    await hoodie.account.signUp({ username, password })
    analytics.signUp(username)
    await dispatch('signIn', { username, password, skipIdentify: true })
  },

  async signIn ({ commit }, { username, password, skipIdentify }) {
    const account = await hoodie.account.signIn({ username, password })
    account.session = await hoodie.account.get('session')
    commit('account', account)
    if (!skipIdentify) analytics.signIn(username)
  },

  async signOut ({ commit }) {
    const account = await hoodie.account.signOut()
    commit('account', account)
    analytics.signOut()
  }
}

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions
}
