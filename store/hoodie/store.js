
import debounce from 'debounce'
import Vue from 'vue'

import { index } from '../utils.js'

const { hoodie } = window

export default {
  namespaced: true,

  state: {
    raw: null
  },

  getters: {
    byID ({ raw }) {
      if (!raw) return null
      const m = index(raw)
      return id => m.get(id)
    }
  },

  mutations: {
    data (state, data) {
      Vue.set(state, 'raw', data)
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
    }
  },

  actions: {
    async init ({ commit }) {
      hoodie.store.on('reset', () => commit('reset'))

      const changes = []
      const flush = debounce(() => {
        commit('changes', changes)
        changes.splice(0, changes.length)
      }, 250)

      hoodie.store.on('change', (kind, doc) => {
        changes.push({ kind, doc })
        flush()
      })

      commit('data', await hoodie.store.findAll())
    },

    async add (context, doc) {
      const added = await hoodie.store.add(doc)
      return added
    },

    async update (context, doc) {
      const updated = await hoodie.store.update(doc)
      return updated
    },

    async remove (context, doc) {
      await hoodie.store.remove(doc)
    }
  }
}
