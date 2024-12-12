<template>
  <n-upload
    class="mx-auto w-[75%] p-20 text-center"
    :show-file-list="true"
    :default-file-list="imgList"
    :action="actionUrl"
    :data="uploadData"
    :max="max"
    :accept="accessList"
    list-type="image-card"
    @before-upload="onBeforeUpload"
    @finish="handleFinish"
    @remove="handleRemove"
  >
    <n-upload-dragger>
      <div class="h-150 f-c-c flex-col">
        <i class="i-mdi:upload mt-12 text-28 color-primary" />
        <n-text class="text-14 color-gray">
          点击或者拖动上传
        </n-text>
      </div>
    </n-upload-dragger>
  </n-upload>
</template>

<script setup>
import qiniu from '@/api/qiniu'

defineOptions({ name: 'ImageUpload' })
const { defaultList } = defineProps({
  // 上传数量限制
  max: {
    type: Number,
    default: 1,
  },
  defaultList: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['uploadSuccess'])
const actionUrl = import.meta.env.VITE_QINIU_UPLOAD // 上传地址
const imgList = reactive(defaultList) // 图片列表
const accessList = '.png,.jpg,.jpeg'
const uploadData = reactive({ // 上传信息
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
    uploadData.key = `${file.id}${file.name}`
    uploadData.token = res.data.token
    return true
  }
  else {
    $message.error('上传凭证获取异常')
    return false
  }
}
// 移除上传列表
function handleRemove({ index }) {
  imgList.splice(index, 1)
}

function handleFinish({ event }) {
  if (event && event.target && event.target.status === 200) {
    const response = JSON.parse(event.target.responseText)
    const fileUrl = response.url // 假设返回的 JSON 对象中有一个 url 字段
    $message.success('上传成功')
    imgList.push({ url: fileUrl })
    emit('uploadSuccess', imgList)
  }
  else {
    $message.error('上传失败')
  }
}
</script>
