import { request } from '@/utils'

// 待施工
export default {
  /**
   * 获取网站信息
   */
  getSiteInfo: () => request.get(`/site/info`),
  /**
   * 更新网站配置
   */
  updateSiteInfo: info => request.post(`/site/update`, info),
}
