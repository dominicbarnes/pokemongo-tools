import Vue from 'vue'
import Vuex from 'vuex'

import { env } from '../config'

import metadata from './metadata'
import account from './account'
import catalog from './catalog'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: { metadata, account, catalog },
  strict: env !== 'production'
})

store.dispatch('init')
store.dispatch('account/init')
store.dispatch('catalog/init')

export default store
