<template>
  <div>
    <div class="flex items-center">
      <n-avatar
        round
        :size="60"
        :src="userStore.avatar"
        class="flex-shrink-0"
      />
      <div class="ml-20 flex-col">
        <span class="text-20 opacity-80">
          {{ greetWords }}
        </span>
      </div>
    </div>
    <div>
      <p class="ml-10 mt-10 opacity-60">
        {{ userStore.description }}
      </p>
      <p class="ml-10 mt-10 opacity-60">
        {{ `${author} : ${verse}` }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store'
import { useTime } from '@/composables'
import api from '@/api/ai'

defineProps({
  bordered: Boolean,
})
const { getPhase } = useTime()
const phase = getPhase()
const userStore = useUserStore()
const greetWords = `${phase}好，${userStore.displayName ?? userStore.userName}`

const verse = ref('')
const author = ref('辛弃疾')
api.getVerse({
  author: author.value,
}).then((res) => {
  if (res.code === 0) {
    verse.value = res.data
  }
})
</script>
