import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 15000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 给请求头添加 Authorization字段，因为后续请求需要这个请求头标识
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    // 后台判断请求成功 是看success字段是否为true
    const { success, message } = response.data
    if (success) {
      return response.data
    } else {
      Message.error(message)
      Promise.reject(message)
    }
  },
  error => {
    // 4xx/5xx进入
    Message.error((error.response && error.response.data && error.response.data.message) || error.message)
    // 10002 token过期
    if (error?.response?.data?.code === 10002) {
      // 退出登录，清空token和用户信息
      store.dispatch('user/loginOutActions')
      // 添加一个参数用来储存，请求失败时，所在的那个路由
      router.replace(`/login?redirect=${router.currentRoute.fullPath}`)
    }
    return Promise.reject(error)
  }
)

export default service
