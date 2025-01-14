import { request } from '@/utils'

/** AI相关接口 */
export default {
  /** 获取诗句接口 */
  getVerse: data => request.post(`/ai/getVerse`, data),
}
