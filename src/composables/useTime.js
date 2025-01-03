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
  return {
    getWeek,
    getDate,
    getCurrentTime,
    getPhase,
  }
}
