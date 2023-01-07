import request from '@/utils/request.js'

/**
 * 登录
 * @param {*} loginInfo 手机号和密码
 * @returns promise
 */
export function loginAPI(loginInfo) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data: loginInfo
  })
}

/**
 *
 * @returns 获取用户信息
 */
export function getUserInfoAPI() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 *
 * @param {*} userId 用户id
 * @returns 获取员工基本信息
 */
export function getUserPhotoAPI(userId) {
  return request({
    url: `/sys/user/${userId}`
  })
}
