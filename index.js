
import './index.css'
import './hoodie.js'

import BootstrapVue from 'bootstrap-vue'
import markdown from 'nano-markdown'
import numeral from 'numeral'
import Vue from 'vue'

import { stage } from './config.js'
import store from './store/index.js'
import router from './router.js'
import App from './components/app.vue'
import LoadingPanel from './components/loading-panel.vue'
import ImgFallback from './directives/img-fallback.js'

Vue.use(BootstrapVue)
Vue.directive('img-fallback', ImgFallback)

Vue.filter('dex', value => `#${numeral(value).format('000')}`)
Vue.filter('markdown', value => markdown(value))
Vue.filter('number', (value, format) => numeral(value).format(format))
Vue.filter('percentage', value => numeral(value).format('0%'))

Vue.component('loading-panel', LoadingPanel)

new Vue({ // eslint-disable-line
  el: '#app',
  router,
  store,
  render (createElement) {
    return createElement(App)
  }
})

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
    console.error('Service worker registration failed', error)
  })
}
