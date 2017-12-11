import 'babel-polyfill'
import './hoodie'

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

import store from './store'
import router from './router'

import App from './components/app.vue'

Vue.use(BootstrapVue)

new Vue({ // eslint-disable-line
  el: '#app',
  router,
  store,
  render (createElement) {
    return createElement(App)
  }
})
