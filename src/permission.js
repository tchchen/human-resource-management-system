import router,{asyncRouteArr} from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })
const whiteList = ['/login', '/404'] // 白名单，不用登录页可 访问的页面

router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  const token = store.getters.token
  if (token) { // 登录了
    if (to.path === '/login') {
      next('/')
      NProgress.done() // 关闭进度条
    } else { // 去别的页面，放行
      next()
      // 没有用户名,那就获取，并添加异步路由
      if (!store.getters.name) {
        // 获取用户信息，拿到登录时返回的权限路由，即这个用户能访问的路由
        const routeList = await store.dispatch('user/getUserInfoActions')
        // 过滤掉用户不能访问的路由
        const newRouterList = asyncRouteArr.filter(routeObj => {
          const routeName = routeObj.children[0].name.toLowerCase()
          return routeList.includes(routeName)
        })
        newRouterList.push({ path: '*', redirect: '/404', hidden: true })
        // 给 内存的路由表 添加路由，这个才能访问，在这里添加上的路由
        router.addRoutes(newRouterList)
        // 改变permission仓库的路由数组，用来渲染左侧导航栏
        store.commit('permission/setRoutes',newRouterList)
        // 因为当在除首页 的其它页面，刷新时内存里的路由表没有权限路由，
        // 所以这时刷新 会进入 404路由。所以当给内存的路由表里添加完 路由，后再重新跳转一次
        next({
          path: to.path,
          replace: true
        })
      }
      
    }
  } else { // 没有登录
    if (whiteList.includes(to.path)) { // 如果去的是 白名单
      next()
    } else {
      next('/login')
      NProgress.done() // 关闭进度条
    }
  }
})

// 当 next() 时才会走 后置路由守卫
router.afterEach((to) => {
  // 浏览器标题
  document.title = getPageTitle(to.meta.title)
  // finish progress bar
  NProgress.done()
})
