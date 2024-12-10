<template>
  <CommonPage>
    <n-upload
      class="mx-auto w-[75%] p-20 text-center"
      :show-file-list="true"
      :default-file-list="imgList"
      :action="actionUrl"
      :data="uploadData"
      :accept="accessList"
      @before-upload="onBeforeUpload"
      @finish="handleFinish"
    >
      <n-upload-dragger>
        <div class="h-150 f-c-c flex-col">
          <i class="i-mdi:upload mb-12 text-68 color-primary" />
          <n-text class="text-14 color-gray">
            点击或者拖动文件到该区域来上传
          </n-text>
        </div>
      </n-upload-dragger>
    </n-upload>
  </CommonPage>
</template>

<script setup>
import qiniu from '@/api/qiniu'

defineOptions({ name: 'ImageUpload' })

const actionUrl = import.meta.env.VITE_QINIU_UPLOAD // 上传地址
const imgList = reactive([]) // 图片列表
const accessList = '.png,.jpg,.jpeg'
const uploadData = ref({ // 上传信息
  key: '',
  token: '',
})

async function onBeforeUpload({ file }) {
  if (!file.file?.type.startsWith('image/')) {
    $message.error('只能上传图片')
    return false
  }
  // 获取上传凭证
  const res = await qiniu.getUploadToken()
  if (res.code === 0) {
    uploadData.value.key = `${file.id}${file.name}`
    uploadData.value.token = res.data.token
    return true
  }
  else {
    $message.error('上传凭证获取异常')
    return false
  }
}

function handleFinish({ file, event }) {
  if (event && event.target && event.target.status === 200) {
    const response = JSON.parse(event.target.responseText)
    const fileUrl = response.url // 假设返回的 JSON 对象中有一个 url 字段
    $message.success('上传成功')
    imgList.push({ fileName: file.name, url: fileUrl })
  }
  else {
    $message.error('上传失败')
  }
}
</script>
