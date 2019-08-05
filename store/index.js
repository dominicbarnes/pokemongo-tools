import Vue from 'vue'
import Vuex from 'vuex'

import { env } from '../config.js'

import hoodie from './hoodie/index.js'
import metadata from './metadata.js'
import catalog from './catalog.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: { hoodie, metadata, catalog },
  strict: env !== 'production'
})

store.dispatch('init')
store.dispatch('hoodie/init')

export default store
