
import Vue from 'vue'

const { hoodie } = window

export default {
  namespaced: true,

  state: {
    properties: null,
    profile: null
  },

  getters: {
    session ({ properties }) {
      return properties && properties.session
    },
    loggedIn (state, { session }) {
      return !!session
    }
  },

  mutations: {
    properties (state, properties) {
      Vue.set(state, 'properties', properties)
    },
    profile (state, profile) {
      Vue.set(state, 'profile', profile)
    }
  },

  actions: {
    async init ({ commit }) {
      hoodie.account.on('signup', properties => commit('properties', properties))
      hoodie.account.on('signin', properties => commit('properties', properties))
      hoodie.account.on('signout', () => commit('properties', null))
      hoodie.account.on('update', properties => commit('properties', properties))

      const properties = await hoodie.account.get(null, { local: true })
      if (properties) commit('properties', properties)

      const profile = await hoodie.account.profile.get()
      if (profile) commit('profile', profile)
    },

    async signUp (context, { username, password }) {
      await hoodie.account.signUp({ username, password })
    },

    async signIn ({ commit }, { username, password }) {
      await hoodie.account.signIn({ username, password })

      const profile = await hoodie.account.profile.get()
      if (profile) commit('profile', profile)
    },

    async signOut (context) {
      await hoodie.account.signOut()
    },

    async profile ({ commit }, profile) {
      commit('profile', await hoodie.account.profile.update(profile))
    }
  }
}
