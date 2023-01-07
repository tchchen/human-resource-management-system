import Vue from 'vue'

import 'normalize.css/normalize.css' // 请求进度条的样式

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // 路由守卫

import PageTools from '@/components/PageTools'
import UploadImg from '@/components/Uploadimg'

Vue.component('PageTools', PageTools)
Vue.component('UploadImg', UploadImg)

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// 注册全局指令
import powerObj from '@/directives/power.js'
Vue.directive('power',powerObj)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
