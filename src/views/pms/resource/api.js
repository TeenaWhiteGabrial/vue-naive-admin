import { request } from '@/utils'

export default {
  getMenuTree: () => request.get('/spc/permission/menu/tree'),
  getButtons: ({ parentId }) => request.get(`/spc/permission/button/${parentId}`),
  addPermission: data => request.post('/spc/permission/add', data),
  savePermission: (id, data) => request.post(`/spc/permission/${id}`, data),
  deletePermission: id => request.post(`/spc/permission/${id}`),
}
