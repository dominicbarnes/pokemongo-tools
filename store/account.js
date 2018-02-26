import Vue from 'vue'

const { hoodie } = window

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
    if (account) window.analytics.identify(account.username)
  },

  async signUp ({ commit, dispatch }, { username, password }) {
    await hoodie.account.signUp({ username, password })
    window.analytics.identify(username)
    window.analytics.track('User Registered')
    await dispatch('signIn', { username, password, skipIdentify: true })
  },

  async signIn ({ commit }, { username, password, skipIdentify }) {
    const account = await hoodie.account.signIn({ username, password })
    account.session = await hoodie.account.get('session')
    commit('account', account)
    if (!skipIdentify) window.analytics.identify(username)
  },

  async signOut ({ commit }) {
    const account = await hoodie.account.signOut()
    commit('account', account)
    window.analytics.reset()
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
