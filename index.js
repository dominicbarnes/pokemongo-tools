import 'babel-polyfill'
import './hoodie'

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import numeral from 'numeral'

import { stage, segmentWriteKey } from './config'
import store from './store'
import router from './router'
import App from './components/app.vue'
import LoadingPanel from './components/loading-panel.vue'

Vue.use(BootstrapVue)

Vue.filter('number', (value, format) => numeral(value).format(format))
Vue.filter('percentage', value => numeral(value).format('0%'))
Vue.filter('dex', value => `#${numeral(value).format('000')}`)

Vue.component('loading-panel', LoadingPanel)

new Vue({ // eslint-disable-line
  el: '#app',
  router,
  store,
  render (createElement) {
    return createElement(App)
  }
})

if (segmentWriteKey) {
  window.analytics.load(segmentWriteKey)
} else {
  console.warn('Segment write key not found, analytics will not be tracked')
}

// replace "no-js" with "js" to signify that JS is running
document.documentElement.className = 'js'

// register service worker
if (stage !== 'development' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '.' }).then(function (reg) {
    if (reg.installing) {
      console.log('Service worker installing')
    } else if (reg.waiting) {
      console.log('Service worker installed')
    } else if (reg.active) {
      console.log('Service worker active')
    }
  }).catch(function (error) {
    // registration failed
    console.error('Registration failed', error)
  })
}
