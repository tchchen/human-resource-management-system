import request from '@/utils/request.js'

/**
 * 
 * @returns 审批列表数据
 */
// 获取所有审批的数据
export function getApprovalListAPI(){
  return request({
    url: '/user/process/instance/1/10',
    method: 'PUT'
  })
}