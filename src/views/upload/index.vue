<template>
  <CommonPage>
    <n-upload
      class="mx-auto w-[75%] p-20 text-center"
      :show-file-list="false"
      :action="actionUrl"
      :data="uploadData"
      accept=".png,.jpg,.jpeg"
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

    <n-card v-if="imgList && imgList.length" class="mt-16 items-center">
      <n-image-group>
        <n-space justify="space-between" align="center">
          <n-card v-for="(item, index) in imgList" :key="index" class="w-280 hover:card-shadow">
            <div class="h-160 f-c-c">
              <n-image width="200" :src="item.url" />
            </div>
            <n-space class="mt-16" justify="space-evenly">
              <n-button dashed type="primary" @click="copy(item.url)">
                url
              </n-button>
              <n-button dashed type="primary" @click="copy(`![${item.fileName}](${item.url})`)">
                MD
              </n-button>
              <n-button
                dashed
                type="primary"
                @click="copy(`&lt;img src=&quot;${item.url}&quot; /&gt;`)"
              >
                img
              </n-button>
            </n-space>
          </n-card>
          <div v-for="i in 4" :key="i" class="w-280" />
        </n-space>
      </n-image-group>
    </n-card>
  </CommonPage>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
import qiniu from '@/api/qiniu'

defineOptions({ name: 'ImgUpload' })

const { copy, copied } = useClipboard()
const actionUrl = import.meta.env.VITE_QINIU_UPLOAD // 上传地址
const imgList = reactive([]) // 图片列表
const uploadData = ref({ // 上传信息
  key: '',
  token: '',
})

watch(copied, (val) => {
  val && $message.success('已复制到剪切板')
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
    // 假设服务器返回的是 JSON 格式，包含文件的 URL
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
