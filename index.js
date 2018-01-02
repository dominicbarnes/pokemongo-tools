import 'babel-polyfill'
import './hoodie'

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import numeral from 'numeral'

import store from './store'
import router from './router'
import App from './components/app.vue'

Vue.use(BootstrapVue)

Vue.filter('number', (value, format) => numeral(value).format(format))
Vue.filter('percentage', value => numeral(value).format('0%'))
Vue.filter('dex', value => `#${numeral(value).format('000')}`)

new Vue({ // eslint-disable-line
  el: '#app',
  router,
  store,
  render (createElement) {
    return createElement(App)
  }
})
