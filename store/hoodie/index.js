
import account from './account.js'
import store from './store.js'
import connection from './connection.js'

export default {
  namespaced: true,

  actions: {
    async init ({ dispatch }) {
      dispatch('account/init')
      dispatch('store/init')
      dispatch('connection/init')
    }
  },

  modules: {
    account,
    store,
    connection
  }
}
