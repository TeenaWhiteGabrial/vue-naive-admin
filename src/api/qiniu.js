import { request } from '@/utils'

export default {
  // 获取上传凭证
  getUploadToken: () => request.get('/upload/getUploadToken'),
}
