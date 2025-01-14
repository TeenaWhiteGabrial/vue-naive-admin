import { request } from '@/utils'

export default {
  /** 获取假日接口 */
  getNextHoliday: date => request.get(`/holiday/nextHoliday/${date}`),

}
