import request from '@/utils/request'

/**
 *
 * @param {*} page 当前页
 * @param {*} limit 请求多少条数据
 * @returns 员工列表数据
 */
export function getStaffListAPI(page, size) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params: {
      page,
      size
    }
  })
}

/**
 *
 * @param {*} obj 员工信息对象
 * @returns 添加员工请求的promise
 */
export function addStaffAPI(obj) {
  return request({
    url: '/sys/user',
    method: 'POST',
    data: obj
  })
}

/**
 * 批量导入员工信息
 * @param {*} data 员工信息对象 
  【员工手机号 员工名字 员工入职日期 格式: 2020-01-01 员工转正日期 格式: 2020-01-01 员工工号】
 * @returns
 */
export function batchStaffAPI(data) {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}

/**
 * 获取员工信息
 * @param {*} id 员工id
 * @returns 员工基本信息
 */
export function getStaffInfoBaseAPI(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}

/**
 * 更新员工信息
 * @param {*} data 员工信息对象
 * @returns
 */
export function updateUserInfoBaseAPI(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}

/**
 *
 * @param {*} id 员工id
 * @param {*} roleList 角色数组
 * @returns
 */
export function assignRoleStaffAPI(id, roleList) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'PUT',
    data: {
      id,
      roleIds: roleList
    }
  })
}

/**
 *
 * @param {*} id 角色id
 * @returns 删除该角色
 */
export function delStaffAPI(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}
