
import Vue from 'vue'

const { hoodie } = window

export default {
  namespaced: true,

  state: {
    ok: null
  },

  getters: {
    online ({ ok }) {
      return !!ok
    },
    offline (state, { online }) {
      return !online
    }
  },

  mutations: {
    props (state, properties) {
      Vue.set(state, 'properties', properties)
    },
    profile (state, profile) {
      Vue.set(state.properties, 'profile', profile)
    }
  },

  actions: {
    async init ({ commit }) {
      hoodie.connectionStatus.on('disconnect reconnect reset', function () {
        console.log('connection status', arguments)
      })

      hoodie.connectionStatus.startChecking({
        interval: 30 * 1000 // 30s
      })
    },

    async check (context) {
      await hoodie.connectionStatus.check()
    }
  }
}
