import { request } from '@/utils'

export default {
  create: data => request.post('/role/add', data),
  read: (params = {}) => request.post('/role/list', params),
  update: data => request.post(`/role/update`, data),
  delete: id => request.post(`/role/delete/${id}`),

  getAllUsers: (params = {}) => request.get('/user', { params }),
  addRoleUsers: (roleId, data) =>
    request.patch(`/role/users/add/${roleId}`, data),
  removeRoleUsers: (roleId, data) =>
    request.patch(`/role/users/remove/${roleId}`, data),
}
