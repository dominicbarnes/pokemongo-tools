
import Vue from 'vue'

const { hoodie } = window

export default {
  namespaced: true,

  state: {
    ok: false
  },

  mutations: {
    ok (state, ok) {
      Vue.set(state, 'ok', ok)
    }
  },

  actions: {
    async init ({ commit }) {
      hoodie.connectionStatus.on('disconnect', () => commit('ok', false))
      hoodie.connectionStatus.on('reconnect reset', () => commit('ok', true))

      await hoodie.connectionStatus.check()
      commit('ok', !!hoodie.connectionStatus.ok)

      hoodie.connectionStatus.startChecking({
        interval: {
          connected: 30 * 1000, // 30s
          disconnected: 5 * 1000 // 5s
        }
      })
    }
  }
}
