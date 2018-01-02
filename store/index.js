import Vue from 'vue'
import Vuex from 'vuex'

import account from './account'
import metadata from './metadata'
import pokemon from './pokemon'
import { env } from '../config'

const { hoodie } = window

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: { account, metadata, pokemon },
  strict: env !== 'production'
})

store.dispatch('account/fetch')
store.dispatch('metadata/fetch')
store.dispatch('pokemon/fetch')

hoodie.store.on('change', (kind, doc) => {
  const { _id: id, type } = doc
  if (!type) return

  const action = `${type}/${kind}`
  switch (kind) {
    case 'add':
      store.commit(action, doc)
      break
    case 'update':
      store.commit(action, doc)
      break
    case 'remove':
      store.commit(action, id)
      break
  }
})

hoodie.account.on('signout', account => {
  store.commit('pokemon/reset')
})

export default store
