import lunisolar from 'lunisolar'
import api from '@/api/common'

export function useTime() {
  function getWeek() {
    const weeks = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return weeks[new Date().getDay()] // 获取星期
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString()
  }

  function getDate() {
    return new Date().toLocaleDateString(
      'zh-CN',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    )
  }

  function getPhase() {
    const hours = new Date().getHours()

    if (hours >= 23 || hours < 5) {
      return '凌晨'
    }
    else if (hours >= 5 && hours < 8) {
      return '早上'
    }
    else if (hours >= 8 && hours < 11) {
      return '上午'
    }
    else if (hours >= 11 && hours < 13) {
      return '中午'
    }
    else if (hours >= 13 && hours < 18) {
      return '下午'
    }
    else if (hours >= 18 && hours < 20) {
      return '傍晚'
    }
    else {
      return '晚上'
    }
  }

  function getLunarDate() {
    const currentTime = new Date().toLocaleDateString()
    return lunisolar(currentTime).format('cYcZ年lMlD')
  }
  /** 获取下一个节假日的信息 */
  async function getNextHoliday() {
    const date = new Date()

    // 获取年、月、日
    const year = date.getFullYear()
    let month = date.getMonth() + 1 // getMonth() 返回的月份是从0开始的，所以需要加1
    let day = date.getDate()

    // 将月和日转换为两位数字的字符串
    month = month < 10 ? `0${month}` : month
    day = day < 10 ? `0${day}` : day

    // 拼接成所需的格式
    const formattedDate = year + month + day

    const res = await api.getNextHoliday(formattedDate)
    if (res.code === 0) {
      return res.data
    }
  }
  return {
    getWeek,
    getDate,
    getCurrentTime,
    getPhase,
    getLunarDate,
    getNextHoliday,
  }
}
