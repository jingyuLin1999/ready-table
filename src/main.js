import Vue from 'vue'
import App from './App.vue'

import router from './router'

import i18n from '@/i18n'

import "@/components/plugin"

Vue.config.productionTip = false

import "vxe-table/lib/style.css";
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')
