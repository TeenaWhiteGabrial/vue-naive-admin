import { request } from '@/utils'

export default {
  getMenuTree: () => request.get('/permission/menu/tree'),
  getButtons: ({ parentId }) => request.get(`/permission/button/${parentId}`),
  addPermission: data => request.post('/permission/add', data),
  savePermission: (id, data) => request.post(`/permission/${id}`, data),
  deletePermission: id => request.post(`permission/${id}`),
}
