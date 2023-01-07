import store from '@/store'

export default { // 自定义指令规则对象
  inserted(el,binding) {
    // 获取用户登录时返回的，按钮权限的标识
    const points = store.state.user.userInfo.roles.points
    // 如果返回的 按钮权限标识数组 没有这个权限，则删除这个按钮
    if(!points.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
}