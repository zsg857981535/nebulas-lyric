// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './theme/index.css'
import { Autocomplete, Button } from 'element-ui'
// import './lib/nebulas'

// import 'element-ui/lib/theme-chalk/index.css'

Vue.component(Autocomplete.name, Autocomplete)
Vue.component(Button.name, Button)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
