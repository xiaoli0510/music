// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import './common/stylus/index.styl'
import VueLazyLoad from 'vue-lazyload'
import store from './store'

Vue.use(VueLazyLoad,{
  error:'./components/myHeader/logo@2x.png',
  loading:'./components/myHeader/logo@2x.png'
})
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)
// import '../src/common/stylus/index.styl'
Vue.use(iView);


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render:h=>h(App)
})
