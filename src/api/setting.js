import request from '@/utils/request.js'

/**
 *
 * @param {*} params 请求的页数、这次请求多少条数据
 * @returns 角色列表
 */
export function getRoleListAPI({ page, pagesize }) {
  return request({
    url: '/sys/role',
    params: {
      page,
      pagesize
    },
    method: 'GET'
  })
}

/**
 *
 * @param {*} companyId 公司id
 * @returns 公司信息
 */
export function getCompanyInfoAPI(companyId) {
  return request({
    url: `/company/${companyId}`,
    method: 'GET'
  })
}

/**
 *
 * @param {*} roleForm 新增角色的信息
 * @returns 新增角色
 */
export function addRolesAPI(roleForm) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data: roleForm
  })
}

/**
 * 修改角色
 * @param {*} roleObj 请求的参数
 * @returns
 */
export function editRolesAPI(roleObj) {
  return request({
    url: `/sys/role/${roleObj.id}`,
    method: 'PUT',
    data: roleObj
  })
}

/**
 * 删除角色
 * @param {*} roleId 角色的id
 * @returns
 */
export function deleteRoleAPI(roleId) {
  return request({
    url: `/sys/role/${roleId}`,
    method: 'DELETE'
  })
}
/**
 * 
 * @param {*} id 角色的id
 * @returns 该角色的详情
 */

export function getRoleDetailAPI(id){
  return request({
    url: `/sys/role/${id}`,
    method: 'GET'
  })
}

/**
 * 
 * @param {*} data 分配给这个角色权限点的 权限点数组 和 这个角色的id
 * @returns 给某个角色分配权限点
 */
export function assignPremAPI(data){
  return request({
    url: '/sys/role/assignPrem',
    method: 'PUT',
    data: data
  })
}