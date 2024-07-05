import { request } from '@/utils'

export default {
  // 登录
  login: data => request.post('/auth/login', data, { noNeedToken: true }),
  // 登出
  logout: () => request.post('/auth/logout'),
  // 获取用户信息
  getUser: () => request.get('/user/info/simple'),
  // 切换当前角色
  switchCurrentRole: role =>
    request.post(`/auth/current-role/switch/${role}`),
  // 获取角色权限菜单
  getRolePermissions: () => request.post('/user/menus'),
  // 验证菜单路径
  validateMenuPath: path =>
    request.get(`/permission/menu/validate?path=${path}`),
}
