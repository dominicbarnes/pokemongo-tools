import Vue from 'vue'

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
  },

  async signUp ({ commit, dispatch }, { username, password }) {
    await hoodie.account.signUp({ username, password })
    await dispatch('signIn', { username, password })
  },

  async signIn ({ commit }, { username, password }) {
    const account = await hoodie.account.signIn({ username, password })
    account.session = await hoodie.account.get('session')
    commit('account', account)
  },

  async signOut ({ commit }) {
    const account = await hoodie.account.signOut()
    commit('account', account)
  }
}

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions
}
