<template>
  <n-card class="w-50%" title="📝 待办清单" segmented>
    <template #header-extra>
      <span class="font-bold opacity-90 text-highlight">🚧 努力施工中......</span>
    </template>

    <n-spin :show="loading">
      <ul class="opacity-90">
        <li v-for="(task, index) in taskList" :key="index" class="py-4">
          {{ task.content }}
        </li>
      </ul>
    </n-spin>

    <n-divider class="mb-0! mt-12!">
      <p class="text-14 opacity-60">
        👉点击
        <b class="mx-2 transition hover:text-primary">
          <a href="https://isme.top" target="_blank">更多</a>
        </b>
        查看更多实用功能，持续开发中...
      </p>
    </n-divider>
  </n-card>
</template>

<script setup>
import taskApi from '@/api/task'

const loading = ref(false)
const taskList = ref([])

onMounted(async () => {
  try {
    loading.value = true
    const res = await taskApi.getList()
    if (res.code === 0) {
      taskList.value = res.data.list || []
    }
  }
  finally {
    loading.value = false
  }
})
</script>
