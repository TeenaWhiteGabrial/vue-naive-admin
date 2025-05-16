import dayjs from 'dayjs'

type TimeInput = string | number | Date | undefined
type FormatString = string

/**
 * 格式化日期时间
 * @param time - 输入的时间
 * @param format - 格式化字符串
 * @returns 格式化后的时间字符串
 */
export function formatDateTime(time: TimeInput = undefined, format: FormatString = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(time).format(format)
}

/**
 * 格式化日期
 * @param date - 输入的日期
 * @param format - 格式化字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: TimeInput = undefined, format: FormatString = 'YYYY-MM-DD'): string {
  return formatDateTime(date, format)
}

/**
 * 节流函数
 * @param fn - 需要节流的函数
 * @param wait - 等待时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, wait: number): (...args: Parameters<T>) => void {
  let context: any
  let args: Parameters<T>
  let previous = 0

  return function (this: any, ...argArr: Parameters<T>) {
    const now = +new Date()
    context = this
    args = argArr
    if (now - previous > wait) {
      fn.apply(context, args)
      previous = now
    }
  }
}

/**
 * 防抖函数
 * @param method - 需要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @param immediate - 是否立即执行
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  method: T,
  wait: number,
  immediate: boolean,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null

  return function (this: any, ...args: Parameters<T>) {
    const context = this

    if (timeout) {
      clearTimeout(timeout)
    }

    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)

      if (callNow) {
        method.apply(context, args)
      }
    }
    else {
      timeout = setTimeout(() => {
        method.apply(context, args)
      }, wait)
    }
  }
}

/**
 * 休眠函数
 * @param time - 休眠时间（毫秒）
 * @returns Promise
 */
export function sleep(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time))
}

/**
 * 监听元素大小变化
 * @param el - HTML元素
 * @param cb - 回调函数
 * @returns ResizeObserver实例
 */
export function useResize(
  el: HTMLElement,
  cb: (rect: DOMRectReadOnly) => void,
): ResizeObserver {
  const observer = new ResizeObserver((entries) => {
    cb(entries[0].contentRect)
  })
  observer.observe(el)
  return observer
}
