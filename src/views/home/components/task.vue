<template>
  <n-card class="w-50%" title="📝 待办清单" segmented>
    <template #header-extra>
      <span class="cursor-pointer font-bold opacity-90 text-highlight" @click="showModal('add')">🆕️ 添加</span>
    </template>

    <n-spin :show="loading">
      <ul class="opacity-90">
        <li v-for="(task, index) in taskList" :key="index" class="flex items-center justify-between py-5 transition-all-300">
          <span class="font-medium opacity-90 transition-opacity-300 hover:opacity-80">{{ task.content }}</span>
          <div class="flex items-center gap-2">
            <n-tag
              :color="getStatusColor(task.state)"
              size="small"
              round
              class="cursor-pointer transition-transform-300 hover:scale-110"
              @click="handleStatusClick(task, index)"
            >
              {{ getStatusText(task.state) }}
            </n-tag>
            <n-button
              size="tiny"
              type="primary"
              class="ml-2"
              @click="showModal('edit', task, index)"
            >
              编辑
            </n-button>
          </div>
        </li>
      </ul>
    </n-spin>
  </n-card>
  <n-modal v-model:show="showFormModal" preset="card" :title="modalTitle" style="width: 600px">
    <n-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-placement="left"
      label-width="auto"
    >
      <n-form-item label="任务类型" path="type">
        <n-select
          v-model:value="formData.type"
          :options="[
            { label: 'WORK', value: '0' },
            { label: 'LIFE', value: '1' },
            { label: '计划中...', value: '2' },
          ]"
        />
      </n-form-item>
      <n-form-item label="截止时间" path="deadLine">
        <n-date-picker v-model:value="formData.deadLine" type="datetime" clearable />
      </n-form-item>
      <n-form-item label="任务内容" path="content">
        <n-input
          v-model:value="formData.content"
          type="textarea"
          placeholder="请输入任务内容"
          :autosize="{ minRows: 3 }"
        />
      </n-form-item>
      <n-form-item label="随笔记" path="notes">
        <n-input
          v-model:value="formData.notes"
          type="textarea"
          placeholder="可记录任务相关笔记"
          :autosize="{ minRows: 2 }"
        />
      </n-form-item>
      <div class="flex justify-end gap-4">
        <n-button @click="showFormModal = false">
          取消
        </n-button>
        <n-button type="primary" @click="handleSubmit">
          确认
        </n-button>
      </div>
    </n-form>
  </n-modal>
</template>

<script setup>
import dayjs from 'dayjs'
import taskApi from '@/api/task'

const loading = ref(false)
const taskList = ref([])

onMounted(async () => {
  try {
    loading.value = true
    const res = await taskApi.getList({
      state: ['0', '1'], // 0 未开始 1 进行中 2 已完成
    })
    if (res.code === 0) {
      taskList.value = res.data || []
    }
  }
  finally {
    loading.value = false
  }
})

function getStatusColor(status) {
  const statusColors = {
    0: '#52c41a', // 未开始-警示红
    1: '#fa8c16', // 进行中-过渡橙
    2: '#52c41a', // 已完成-确认绿
  }
  return {
    color: statusColors[status],
    textColor: status === 1 ? '#fff' : '#fff', // 橙色背景配白字，其他深色背景配白字
    borderColor: 'transparent',
  } || {}
}

function getStatusText(status) {
  const statusMap = {
    0: '未开始',
    1: '进行中',
    2: '已完成',
  }
  return statusMap[status] || '未知'
}

async function handleStatusClick(task, index) {
  try {
    const newState = (Number.parseInt(task.state) + 1) % 3
    const res = await taskApi.update({
      _id: task._id,
      state: newState.toString(),
    })

    if (res.code === 0) {
      taskList.value[index].state = newState.toString()
      window.$message?.success('状态更新成功')
    }
  }
  catch (error) {
    window.$message?.error('状态更新失败')
  }
}

const showFormModal = ref(false)
const modalTitle = ref('')
const formRef = ref(null)
const formData = ref({
  type: 0,
  deadLine: null,
  content: '',
  notes: '',
})

const formRules = {
  type: {
    required: true,
    message: '请选择任务类型',
    trigger: ['blur', 'change'],
  },
  deadLine: {
    required: true,
    message: '请选择截止时间',
    trigger: ['blur', 'change'],
  },
  content: {
    required: true,
    message: '请输入任务内容',
    trigger: ['blur', 'change'],
  },
}

function showModal(action, task) {
  modalTitle.value = action === 'add' ? '新建任务' : '编辑任务'
  if (action === 'edit') {
    formData.value = {
      ...task,
      deadLine: task.deadLine ? dayjs(task.deadLine).valueOf() : null,
    }
  }
  else {
    formData.value = { type: 0, deadLine: null, content: '', notes: '' }
  }
  showFormModal.value = true
}

async function handleSubmit() {
  try {
    await formRef.value.validate()
    const payload = {
      ...formData.value,
      deadLine: formData.value.deadLine ? dayjs(formData.value.deadLine).format('YYYY-MM-DD HH:mm') : null,
    }

    const res = modalTitle.value === '新建任务'
      ? await taskApi.create(payload)
      : await taskApi.update({ ...payload, _id: formData.value._id })

    if (res.code === 0) {
      window.$message?.success(`${modalTitle.value}成功`)
      showFormModal.value = false
      await refreshTaskList()
    }
  }
  catch (error) {
    console.error('表单提交失败:', error)
  }
}

async function refreshTaskList() {
  try {
    const res = await taskApi.getList({ state: ['0', '1'] })
    if (res.code === 0)
      taskList.value = res.data || []
  }
  catch (error) {
    console.error('刷新任务列表失败:', error)
  }
}
</script>
