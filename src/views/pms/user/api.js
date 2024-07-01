import { request } from '@/utils'

export default {
  create: data => request.post('/user/add', data),
  read: (params = {}) => request.post('/user/list', { params }),
  update: data => request.post(`/user/${data.id}`, data),
  delete: id => request.post(`/user/${id}`),
  resetPwd: (id, data) => request.patch(`/user/password/reset/${id}`, data),

  getAllRoles: () => request.get('/role?enable=1'),
}
