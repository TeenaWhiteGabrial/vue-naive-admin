import { request } from '@/utils'

export default {
  // 获取上传凭证
  getUploadToken: () => request.get('http://39.105.212.130:9090/upload/getUploadToken'),
}
