import Vue from 'vue'
import Vuex from 'vuex'

import { env } from '../config'

import hoodie from './hoodie'
import metadata from './metadata'
import catalog from './catalog'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: { hoodie, metadata, catalog },
  strict: env !== 'production'
})

store.dispatch('init')
store.dispatch('hoodie/init')

export default store
