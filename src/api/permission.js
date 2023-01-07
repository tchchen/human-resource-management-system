import request from '@/utils/request'

/**
 *
 * @returns 所有权限点数据
 */
export function getPermissionListAPI() {
  return request({
    url: '/sys/permission',
    method: 'GET'
  })
}

/**
 *
 * @param {*} formObj
 * @returns 添加权限
 */
export function addPermissionAPI(formObj) {
  return request({
    url: '/sys/permission',
    method: 'POST',
    data: formObj
  })
}

/**
 *
 * @param {*} id 权限的id
 * @returns 权限点的详情
 */
export function getPermissionDetailAPI(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'GET'
  })
}

/**
 *
 * @param {*} id
 * @returns 编辑权限
 */
export function editPermissonAPi(data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'PUT',
    data
  })
}

/**
 *
 * @param {*} id 被删除的权限的id
 * @returns 删除权限点
 */
export function delPermissonAPI(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'DELETE'
  })
}

