import Vue from 'vue'

const { hoodie } = window

const state = {
  properties: null,
  profile: Object.create(null),
  session: null,
  ready: false
}

const getters = {
  loggedIn ({ properties, session }) {
    if (!properties) return false
    if (!session) return false
    return !!session.id
  },

  username ({ properties, profile }, { loggedIn }) {
    if (!loggedIn) return
    if (profile && profile.nickname) return profile.nickname
    return properties.username
  }
}

const mutations = {
  properties (state, properties) {
    if (properties.session) {
      Vue.set(state, 'session', properties.session)
      delete (properties.session)
    }
    Vue.set(state, 'properties', properties)
  },
  session (state, session) {
    Vue.set(state, 'session', session)
  },
  profile (state, profile) {
    Vue.set(state, 'profile', profile)
  },
  ready (state) {
    Vue.set(state, 'ready', true)
  }
}

const actions = {
  async init ({ commit }) {
    const properties = await hoodie.account.get(null, { local: true })
    commit('properties', properties)
    const profile = await hoodie.account.profile.get()
    commit('profile', profile)
    if (properties) window.analytics.identify(properties.id, { username: properties.username })
    commit('ready')
  },

  async signUp ({ commit, dispatch }, { username, password }) {
    const properties = await hoodie.account.signUp({ username, password })
    window.analytics.identify(properties.id, { username: properties.username })
    window.analytics.track('User Registered')
    await dispatch('signIn', { username, password, skipIdentify: true })
  },

  async signIn ({ commit }, { username, password, skipIdentify }) {
    const properties = await hoodie.account.signIn({ username, password })
    const session = await hoodie.account.get('session')
    commit('properties', properties)
    commit('session', session)
    if (!skipIdentify) window.analytics.identify(properties.id, { username: properties.username })
  },

  async update ({ commit }, changes) {
    const profile = await hoodie.account.profile.update(changes)
    commit('profile', profile)
  },

  async signOut ({ commit }) {
    const properties = await hoodie.account.signOut()
    commit('properties', properties)
    commit('session', null)
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
