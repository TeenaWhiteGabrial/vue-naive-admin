import { request } from '@/utils'

export default {
  create: data => request.post('/spc/task/add', data),
  update: data => request.post('/spc/task/update', data),
  getList: (params = {}) => request.post('/spc/task/list', params),
  detail: data => request.post('/spc/task/detail', data),
  delete: data => request.post('/spc/task/delete', data),
}
