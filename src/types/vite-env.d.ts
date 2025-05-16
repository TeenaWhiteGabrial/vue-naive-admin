/// <reference types="vite/client" />

import type { LoadingBarProviderInst, NotificationProviderInst } from 'naive-ui'
import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider' // 导入 DialogApiInjection

// 针对 setupMessage 返回的实例类型，我们创建一个更具体的类型
// 这需要您从 naiveTools.ts 中导出 Message 类，或者在这里重新定义其结构
// 假设 Message 类的结构如下 (简化版，您需要根据实际情况调整)
interface CustomMessageApi {
  loading: (content: string, option?: any) => void
  success: (content: string, option?: any) => void
  error: (content: string, option?: any) => void
  info: (content: string, option?: any) => void
  warning: (content: string, option?: any) => void
  // 如果还有其他方法，也需要在这里声明
}

declare global {
  interface Window {
    $loadingBar: LoadingBarProviderInst
    $notification: NotificationProviderInst
    $message: CustomMessageApi // 使用上面定义的 CustomMessageApi
    $dialog: DialogApiInjection // DialogProviderInst 通常是 NDialog 本身，setupDialog 返回的是扩展后的 NDialog
  }
}
