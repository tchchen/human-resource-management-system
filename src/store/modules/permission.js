import {constantRoutes} from '@/router'

export default {
  namespaced:true,
  state: () => {
    return {
      routes: constantRoutes // 给左侧导航栏渲染的路由数组
    }
  },
  mutations: {
    // 因为路由数组是通过addRoutes()添加的，所以通过$route获取不到。
    // 所以当用户登录时，把路由数组存一份在vuex中，供左侧导航栏使用
    setRoutes(state,asyncRouteArr){
      state.routes = [...constantRoutes,...asyncRouteArr]
    }
  }
}