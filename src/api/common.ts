import { request } from '@/utils'

export default {
  /** 获取假日接口 */
  getNextHoliday: (date: string) => request.get(`/spc/holiday/nextHoliday/${date}`),

}
