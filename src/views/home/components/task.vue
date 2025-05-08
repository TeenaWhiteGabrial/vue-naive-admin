<template>
  <n-card class="w-full" segmented>
    <template #header>
      <div flex gap-16>
        <div>📝 待办清单</div>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button size="small" @click="refreshTaskList(['0', '1'])">
              <template #icon>
                <n-icon>
                  <Refresh />
                </n-icon>
              </template>
            </n-button>
          </template>
          刷新待办
        </n-tooltip>
      </div>
    </template>
    <template #header-extra>
      <div class="flex items-center gap-4">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button size="small" @click="showModal('add')">
              <template #icon>
                <n-icon>
                  <AddCircle />
                </n-icon>
              </template>
            </n-button>
          </template>
          新建任务
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button size="small" @click="refreshTaskList(['2'])">
              <template #icon>
                <n-icon>
                  <Recording />
                </n-icon>
              </template>
            </n-button>
          </template>
          已完成的任务
        </n-tooltip>
      </div>
    </template>

    <n-spin :show="loading">
      <div class="grid grid-cols-3 gap-12">
        <div v-for="type in taskTypes" :key="type.value" class="opacity-90">
          <h3 class="mb-4 text-center font-bold" :class="getTypeClass(type.value)">
            {{ type.label }}
          </h3>
          <ul class="space-y-3">
            <li v-for="(task, index) in filteredTasks(type.value)" :key="index">
              <n-card size="small" class="task-card cursor-pointer transition-all-300 hover:shadow-md">
                <div class="flex items-center justify-between">
                  <span
                    class="task-title font-medium opacity-90 transition-opacity-300 hover:opacity-80" :class="{
                      'text-work': task.type === '0',
                      'text-life': task.type === '1',
                      'text-star': task.type === '2',
                    }"
                  >
                    {{ task.content }}
                  </span>
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
                </div>
                <div v-if="task.notes" class="notes-container">
                  <div
                    v-for="(note, noteIndex) in task.notes.split('\n')"
                    :key="noteIndex"
                    class="note-item"
                  >
                    <span class="note-bullet">•</span>
                    <span class="note-content">{{ note }}</span>
                  </div>
                  <div v-if="task.deadLine" class="deadline-container">
                    <n-icon size="14" class="deadline-icon">
                      <TimerOutline />
                    </n-icon>
                    <span class="deadline-text">{{ formatDeadline(task.deadLine) }}</span>
                  </div>
                </div>
              </n-card>
            </li>
          </ul>
        </div>
      </div>
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
            { label: 'OTHER', value: '2' },
          ]"
        />
      </n-form-item>
      <n-form-item label="截止时间" path="deadLine">
        <n-date-picker v-model:value="formData.deadLine" type="date" clearable />
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
import { onMounted, ref } from 'vue'
import { AddCircle, Recording, Refresh, TimerOutline } from '@vicons/ionicons5'
import taskApi from '@/api/task'

const loading = ref(false)
const taskList = ref([])

const taskTypes = [
  { label: 'WORK', value: '0' },
  { label: 'LIFE', value: '1' },
  { label: 'STAR', value: '2' },
]

onMounted(async () => {
  try {
    loading.value = true
    refreshTaskList(['0', '1'])
  }
  finally {
    loading.value = false
  }
})

function filteredTasks(type) {
  return taskList.value.filter(task => task.type === type)
}

function getTypeClass(type) {
  return {
    0: 'text-work',
    1: 'text-life',
    2: 'text-star',
  }[type]
}

function getStatusColor(status) {
  const statusColors = {
    0: '#52c41a', // 未开始-警示红
    1: '#fa8c16', // 进行中-过渡橙
    2: '#333', // 已完成-确认绿
  }
  return {
    color: statusColors[status],
    textColor: status === 1 ? '#fff' : '#fff',
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

function formatDeadline(deadline) {
  if (!deadline)
    return ''
  return dayjs(deadline).format('YYYY-MM-DD')
}

async function handleStatusClick(task, index) {
  if (task.state === '2') {
    return
  }
  try {
    const newState = Number.parseInt(task.state) + 1 // (Number.parseInt(task.state) + 1) % 3
    const res = await taskApi.update({
      _id: task._id,
      state: newState.toString(),
    })

    if (res.code === 0) {
      taskList.value[index].state = newState.toString()
      window.$message?.success('状态更新成功')
      refreshTaskList(['0', '1'])
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
  type: '0',
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
    validator: (rule, value) => {
      // 修改校验逻辑，兼容时间戳格式
      return !!value || value === 0
    },
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
    formData.value = { type: '0', deadLine: null, content: '', notes: '' }
  }
  showFormModal.value = true
}

async function handleSubmit() {
  try {
    await formRef.value.validate()
    const payload = {
      ...formData.value,
      deadLine: formData.value.deadLine ? dayjs(formData.value.deadLine).format('YYYY-MM-DD HH:mm') : null,
      state: '0',
    }

    const res = modalTitle.value === '新建任务'
      ? await taskApi.create(payload)
      : await taskApi.update({ ...payload, _id: formData.value._id })

    if (res.code === 0) {
      window.$message?.success(`${modalTitle.value}成功`)
      showFormModal.value = false
      await refreshTaskList(['0', '1'])
    }
  }
  catch (error) {
    console.error('表单提交失败:', error)
  }
}

async function refreshTaskList(state = ['0', '1']) {
  try {
    const res = await taskApi.getList({ state })
    if (res.code === 0)
      taskList.value = res.data || []
  }
  catch (error) {
    console.error('刷新任务列表失败:', error)
  }
}
</script>

<style scoped>
  .text-work {
    color: #1890ff;
  }

  .text-life {
    color: #52c41a;
  }

  .text-star {
    color: #722ed1;
  }

  .task-card {
    border-radius: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .task-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .task-title {
    font-weight: 500;
    line-height: 1.4;
  }

  .deadline-container {
    display: flex;
    align-items: center;
    margin-top: 16px;
    padding: 6px 10px;
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    font-size: 13px;
    border-left: 3px solid #faad14;
  }

  .deadline-icon {
    margin-right: 8px;
    color: #fa8c16;
    font-size: 16px;
  }

  .deadline-text {
    color: #333;
    font-weight: 600;
  }

  .deadline-text::before {
    content: '截止时间: ';
    color: #fa8c16;
    font-weight: 600;
  }

  .notes-container {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px dashed rgba(0, 0, 0, 0.06);
  }

  .note-item {
    display: flex;
    align-items: flex-start;
    font-size: 12px;
    color: #666;
    margin-bottom: 2px;
  }

  .note-bullet {
    margin-right: 8px;
    color: #aaa;
  }

  .note-content {
    line-height: 1.5;
  }
</style>
