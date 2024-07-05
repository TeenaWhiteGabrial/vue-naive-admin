import { request } from '@/utils'

export default {
  create: data => request.post('/user/add', data),
  read: (params = {}) => request.post('/user/list', { params }),
  update: data => request.post(`/user/update/${data.userId}`, data),
  delete: id => request.post(`/user/delete/${id}`),
  resetPwd: (id, data) => request.patch(`/user/password/reset/${id}`, data),

  getAllRoles: data => request.post('/role/list', data),
}