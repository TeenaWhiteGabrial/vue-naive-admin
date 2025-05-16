import { request } from '@/utils'

export default {
  create: data => request.post('/spc/user/add', data),
  read: (params = {}) => request.post('/spc/user/list', { params }),
  update: data => request.post(`/spc/user/update/${data.userId}`, data),
  delete: id => request.post(`/spc/user/delete/${id}`),
  resetPwd: data => request.post(`/spc/user/resetPassword`, data),

  getAllRoles: data => request.post('/spc/role/list', data),
}
