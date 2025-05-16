import { isNullOrUndef } from '@/utils'

interface StorageOption {
  storage: Storage
  prefixKey: string
}

interface StorageData<T = any> {
  value: T
  time: number
  expire: number | null
}

class WebStorage {
  private storage: Storage
  private prefixKey: string

  constructor(option: StorageOption) {
    this.storage = option.storage
    this.prefixKey = option.prefixKey
  }

  getKey(key: string): string {
    return `${this.prefixKey}${key}`.toLowerCase()
  }

  set<T = any>(key: string, value: T, expire?: number): void {
    const currentTime = new Date().getTime()
    const stringData = JSON.stringify({
      value,
      time: currentTime,
      expire: typeof expire === 'number' ? currentTime + expire * 1000 : null,
    })
    this.storage.setItem(this.getKey(key), stringData)
  }

  get<T = any>(key: string): T | undefined {
    const defaultData: StorageData<T> = {
      value: undefined as T,
      time: Date.now(),
      expire: null,
    }
    const { value } = this.getItem<T>(key, defaultData) || defaultData
    return value
  }

  getItem<T = any>(key: string, def: StorageData<T> | null = null): StorageData<T> | null {
    const val = this.storage.getItem(this.getKey(key))
    if (!val)
      return def
    try {
      const data = JSON.parse(val) as StorageData<T>
      const { value, time, expire } = data
      if (isNullOrUndef(expire) || (expire && expire > new Date().getTime())) {
        return { value, time, expire }
      }
      this.remove(key)
      return def
    }
    catch (error) {
      this.remove(key)
      return def
    }
  }

  remove(key: string): void {
    this.storage.removeItem(this.getKey(key))
  }

  clear(): void {
    this.storage.clear()
  }
}

interface CreateStorageOptions {
  prefixKey?: string
  storage?: Storage
}

export function createStorage({ prefixKey = '', storage = sessionStorage }: CreateStorageOptions = {}): WebStorage {
  return new WebStorage({ prefixKey, storage })
}
