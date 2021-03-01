import Vue from 'vue'
import App from './App.vue'
import store from './store'


export type Thing = {foo: string, type: Thing}

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
