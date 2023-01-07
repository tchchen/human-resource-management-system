import request from '@/utils/request.js'

/**
 *
 * @returns 组织架构列表
 */
export function getDepartmentListAPI() {
  return request({
    url: '/company/department',
    method: 'GET'
  })
}

/**
 *
 * @returns 负责人列表
 */
export function getSimpleListAPI() {
  return request({
    url: '/sys/user/simple',
    method: 'GET'
  })
}

/**
 *
 * @param {*} data
 * @returns 添加子部门
 */
export function addDepartmentAPI(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data: data
  })
}

/**
 *
 * @param {*} id 部门id
 * @returns 获取某部门的详情
 */
export function getDepartmentDetailsAPI(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'GET'
  })
}

/**
 *
 * @param {*} fromObj 部门信息
 * @returns
 */
export function updateDepartmentDetailAPI(fromObj) {
  return request({
    url: `/company/department/${fromObj.id}`,
    method: 'PUT',
    data: fromObj
  })
}

/**
 *
 * @param {*} id 被删除部门的id
 * @returns
 */
export function deleteDepartmentAPI(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
