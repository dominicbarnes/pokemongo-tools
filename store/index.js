import Vue from 'vue'
import Vuex from 'vuex'

import account from './account'
import metadata from './metadata'
import pokemon from './pokemon'
import { env } from '../config'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: { account, metadata, pokemon },
  strict: env !== 'production'
})

store.dispatch('init')
store.dispatch('account/init')
store.dispatch('pokemon/init')

export default store
