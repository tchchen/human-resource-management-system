import { loginAPI, getUserInfoAPI, getUserPhotoAPI } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {},
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 设置token
  SET_TOKEN: (state, token) => {
    // vuex和本地都存一份
    state.token = token
    setToken(token)
  },
  // 删除token
  REMOVE_TOKEN(state) {
    // 删除vuex和本地的token
    state.token = ''
    removeToken()
  },
  // 修改用户名
  SET_NAME: (state, name) => {
    state.name = name
  },
  // 修改头像
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 设置用户信息
  SET_USERINFO(state, value) {
    state.userInfo = value
  },
  // 删除用户信息
  REMOVE_USERINFO(state) {
    state.userInfo = {}
  }
}

const actions = {
  // 发起登录请求
  async loginActions({ commit }, userInfo) {
    const res = await loginAPI(userInfo)
    // 设置token
    commit('SET_TOKEN', res.data)
  },
  // 获取用户信息
  async getUserInfoActions({ commit }) {
    const { data: userObj } = await getUserInfoAPI() // 获取用户基本信息
    const res = await getUserPhotoAPI(userObj.userId) // 获取用户信息【更全】
    commit('SET_USERINFO', { ...userObj, ...res.data })
    return userObj.roles.menus // 返回用户登录返回的 他能访问的 路由name数组
  },
  // 退出登录
  loginOutActions({ commit }) {
    // 请除token和用户信息
    commit('REMOVE_USERINFO')
    commit('REMOVE_TOKEN')
    // 请空内存里的路由表
    resetRouter()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

