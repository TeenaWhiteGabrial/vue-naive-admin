import { createStorage } from './storage'

interface StorageOptions {
  prefixKey?: string
}
const prefixKey = 'vue-naive-admin_'

export const createLocalStorage = function (option: StorageOptions = {}) {
  return createStorage({
    prefixKey: option.prefixKey || '',
    storage: localStorage,
  })
}

export const createSessionStorage = function (option: StorageOptions = {}) {
  return createStorage({
    prefixKey: option.prefixKey || '',
    storage: sessionStorage,
  })
}

export const lStorage = createLocalStorage({ prefixKey })

export const sStorage = createSessionStorage({ prefixKey })
