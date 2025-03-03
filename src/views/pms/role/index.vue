<template>
  <CommonPage>
    <template #action>
      <NButton type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        新增角色
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="600"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="角色名" :label-width="50">
        <n-input
          v-model:value="queryItems.name"
          type="text"
          placeholder="请输入角色名"
          clearable
        />
      </MeQueryItem>
    </MeCrud>
    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
      >
        <n-form-item
          label="角色名"
          path="name"
          :rule="{
            required: true,
            message: '请输入角色名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item
          label="角色编码"
          path="code"
          :rule="{
            required: true,
            message: '请输入角色编码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.code"
            :disabled="modalAction !== 'add'"
          />
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NSwitch } from 'naive-ui'
import api from './api'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'

defineOptions({ name: 'RoleMgt' })

// const router = useRouter();

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const {
  modalRef,
  modalFormRef,
  modalAction,
  modalForm,
  handleAdd,
  handleDelete,
  handleEdit,
} = useCrud({
  name: '角色',
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  initForm: {},
  refresh: (_, keepCurrentPage) => $table.value?.handleSearch(keepCurrentPage),
})

const columns = [
  { title: '角色名', width: 200, key: 'name' },
  { title: '角色编码', width: 200, key: 'code' },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    align: 'right',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN',
            onClick: () => handleEdit(row),
          },
          {
            default: () => '编辑',
            icon: () =>
              h('i', { class: 'i-material-symbols:edit-outline text-14' }),
          },
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN',
            onClick: () => handleDelete(row.code),
          },
          {
            default: () => '删除',
            icon: () =>
              h('i', { class: 'i-material-symbols:delete-outline text-14' }),
          },
        ),
      ]
    },
  },
]
</script>
