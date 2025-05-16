import * as NaiveUI from 'naive-ui'
import type { DialogApi, LoadingBarApi, MessageApi, NotificationApi } from 'naive-ui'
import { isNullOrUndef } from '@/utils'
import { useAppStore } from '@/store'

interface MessageOptions {
  key?: string
  duration?: number
  [key: string]: any
}

interface MessageInstance {
  type: 'info' | 'success' | 'warning' | 'error' | 'loading'
  content: string | number | null
  destroy: () => void
}

export function setupMessage(NMessage: MessageApi) {
  class Message {
    static instance: Message
    private message: Record<string, MessageInstance> | undefined
    private removeTimer: Record<string, ReturnType<typeof setTimeout>> | undefined

    constructor() {
      if (Message.instance)
        return Message.instance
      Message.instance = this
      this.message = {}
      this.removeTimer = {}
    }

    removeMessage(key: string, duration: number = 5000): void {
      if (this.removeTimer?.[key]) {
        clearTimeout(this.removeTimer[key])
      }
      if (!this.message || !this.removeTimer) {
        return
      }

      this.removeTimer[key] = setTimeout(() => {
        if (this.message?.[key]?.destroy) {
          this.message[key].destroy()
        }
      }, duration)
    }

    destroy(key: string, duration: number = 200): void {
      setTimeout(() => {
        this.message?.[key]?.destroy()
      }, duration)
    }

    showMessage(type: 'info' | 'success' | 'warning' | 'error' | 'loading', content: string | string[], option: MessageOptions = {}): void {
      if (Array.isArray(content)) {
        content.forEach(msg => NMessage[type](msg, option))
        return
      }

      if (!option.key) {
        NMessage[type](content, option)
        return
      }

      const currentMessage = this.message?.[option.key]
      if (currentMessage) {
        currentMessage.type = type
        currentMessage.content = content || '' // 确保content不为undefined
      }
      else {
        const messageInstance = NMessage[type](content, {
          ...option,
          duration: 0,
          onAfterLeave: () => {
            if (this.message && option.key) {
              delete this.message[option.key]
            }
          },
        })

        if (this.message && messageInstance) {
          this.message[option.key] = {
            type,
            content: content || '', // 确保content不为undefined
            destroy: messageInstance.destroy,
          }
        }
      }
      this.removeMessage(option.key, option.duration)
    }

    loading(content: string | string[], option?: MessageOptions): void {
      this.showMessage('loading', content, option)
    }

    success(content: string | string[], option?: MessageOptions): void {
      this.showMessage('success', content, option)
    }

    error(content: string | string[], option?: MessageOptions): void {
      this.showMessage('error', content, option)
    }

    info(content: string | string[], option?: MessageOptions): void {
      this.showMessage('info', content, option)
    }

    warning(content: string | string[], option?: MessageOptions): void {
      this.showMessage('warning', content, option)
    }
  }

  return new Message()
}

interface DialogOptions {
  title?: string
  type?: 'info' | 'success' | 'warning' | 'error'
  confirm?: () => void
  cancel?: () => void
  [key: string]: any
}

export function setupDialog(NDialog: DialogApi) {
  const dialog = {
    ...NDialog,
    confirm(option: DialogOptions = {}) {
      const showIcon = !isNullOrUndef(option.title)

      return NDialog[option.type || 'warning']({
        showIcon,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: option.confirm,
        onNegativeClick: option.cancel,
        onMaskClick: option.cancel,
        ...option,
      })
    },
  }

  return dialog
}

declare global {
  interface Window {
    $loadingBar: LoadingBarApi
    $notification: NotificationApi
    $message: ReturnType<typeof setupMessage>
    $dialog: ReturnType<typeof setupDialog>
  }
}

export function setupNaiveDiscreteApi(): void {
  const appStore = useAppStore()
  const configProviderProps = computed(() => ({
    theme: appStore.isDark ? NaiveUI.darkTheme : undefined,
    themeOverrides: useAppStore().naiveThemeOverrides,
  }))
  const { message, dialog, notification, loadingBar } = NaiveUI.createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar'],
    { configProviderProps },
  )

  window.$loadingBar = loadingBar
  window.$notification = notification
  window.$message = setupMessage(message)
  window.$dialog = setupDialog(dialog)
}
