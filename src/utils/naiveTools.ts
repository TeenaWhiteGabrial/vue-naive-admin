import * as NaiveUI from 'naive-ui'
import { isNullOrUndef } from '@/utils'
import { useAppStore } from '@/store'
import type { MessageApi, DialogApi, NotificationApi, LoadingBarApi } from 'naive-ui'

interface MessageOptions {
  key?: string
  duration?: number
  [key: string]: any
}

interface MessageInstance {
  type: string
  content: string | number
  destroy: () => void
}

export function setupMessage(NMessage: MessageApi) {
  class Message {
    static instance: Message
    private message: Record<string, MessageInstance> | undefined
    private removeTimer: Record<string, NodeJS.Timeout> | undefined

    constructor() {
      if (Message.instance)
        return Message.instance
      Message.instance = this
      this.message = {}
      this.removeTimer = {}
    }

    removeMessage(key: string, duration: number = 5000): void {
      this.removeTimer[key] && clearTimeout(this.removeTimer[key])
      this.removeTimer[key] = setTimeout(() => {
        this.message[key]?.destroy()
      }, duration)
    }

    destroy(key: string, duration: number = 200): void {
      setTimeout(() => {
        this.message[key]?.destroy()
      }, duration)
    }

    showMessage(type: string, content: string | string[], option: MessageOptions = {}): void {
      if (Array.isArray(content)) {
        content.forEach(msg => NMessage[type](msg, option))
        return
      }

      if (!option.key) {
        NMessage[type](content, option)
        return
      }

      const currentMessage = this.message[option.key]
      if (currentMessage) {
        currentMessage.type = type
        currentMessage.content = content
      }
      else {
        this.message[option.key] = NMessage[type](content, {
          ...option,
          duration: 0,
          onAfterLeave: () => {
            delete this.message[option.key]
          },
        })
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
  type?: string
  confirm?: () => void
  cancel?: () => void
  [key: string]: any
}

export function setupDialog(NDialog: DialogApi) {
  NDialog.confirm = function (option: DialogOptions = {}) {
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
  }

  return NDialog
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
