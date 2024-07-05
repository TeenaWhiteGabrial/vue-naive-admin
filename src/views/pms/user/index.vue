<template>
  <CommonPage>
    <template #action>
      <NButton v-permission="'AddUser'" type="primary" @click="createUser()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建新用户
      </NButton>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="状态" :label-width="50">
        <n-select
          v-model:value="queryItems.status"
          clearable
          :options="[
            { label: '在线', value: 'online' },
            { label: '下线', value: 'offline' },
          ]"
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
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="用户名"
          path="userName"
          :rule="{
            required: true,
            message: '请输入用户名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.userName"
            :disabled="modalAction !== 'add'"
          />
        </n-form-item>
        <n-form-item
          v-if="['add', 'reset'].includes(modalAction)"
          :label="modalAction === 'reset' ? '重置密码' : '初始密码'"
          path="password"
          :rule="{
            required: true,
            message: '请输入密码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.password" />
        </n-form-item>

        <n-form-item
          v-if="['setRole'].includes(modalAction)"
          label="权限"
          path="role"
        >
          <n-select
            v-model:value="modalForm.role"
            :options="roleList"
            label-field="name"
            value-field="code"
            clearable
            filterable
          />
        </n-form-item>
        <n-form-item v-if="modalAction === ''" label="状态" path="status">
          <NSwitch
            v-model:value="modalForm.status"
            checked-value="online"
            unchecked-value="offline"
          >
            <template #checked>
              上线
            </template>
            <template #unchecked>
              下线
            </template>
          </NSwitch>
        </n-form-item>
      </n-form>
      <n-alert v-if="modalAction === 'add'" type="warning" closable>
        详细信息需由用户本人补充修改
      </n-alert>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import api from '@/api/user'
import { MeCrud, MeModal, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const roleList = ref([])
api.getAllRoles({}).then(({ data = [] }) => (roleList.value = data))

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleDelete,
  handleOpen,
  handleSave,
} = useCrud({
  name: '用户',
  initForm: { status: 'online' },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

const columns = [
  {
    title: '头像',
    key: 'avatar',
    width: 80,
    render: ({ avatar }) =>
      h(NAvatar, {
        size: 'medium',
        src: avatar,
      }),
  },
  { title: '账号', key: 'userName', width: 100, ellipsis: { tooltip: true } },
  {
    title: '姓名',
    key: 'displayName',
    width: 80,
    ellipsis: { tooltip: true },
  },
  {
    title: '所属部门',
    key: 'department',
    width: 100,
    ellipsis: { tooltip: true },
  },
  {
    title: '权限',
    key: 'role',
    width: 100,
    ellipsis: { tooltip: true },
    render: ({ role }) => {
      if (role) {
        return h(
          NTag,
          { type: 'success' },
          {
            default: () =>
              roleList.value.find(item => role === item.code)?.name ?? '',
          },
        )
      }
      return '暂无权限'
    },
  },
  { title: '邮箱', key: 'email', width: 150, ellipsis: { tooltip: true } },
  {
    title: '状态',
    key: 'status',
    width: 120,
    render: row =>
      h(
        NSwitch,
        {
          'size': 'small',
          'rubberBand': false,
          'disabled': true,
          'value': row.status,
          'loading': !!row.enableLoading,
          'checked-value': 'online',
          'unchecked-value': 'offline',
        },
        {
          checked: () => '在线',
          unchecked: () => '下线',
        },
      ),
  },
  {
    title: '操作',
    key: 'actions',
    width: 320,
    align: 'right',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            secondary: true,
            onClick: () => handleOpenRolesSet(row),
          },
          {
            default: () => '授权',
            icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () =>
              handleOpen({
                action: 'reset',
                title: '重置密码',
                row,
                onOk: onSave,
              }),
          },
          {
            default: () => '重置密码',
            icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),
          },
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDelete(row.userId),
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

function onSave() {
  if (modalAction.value === 'add') {
    const result = {
      userName: modalForm.value.userName,
      password: btoa(modalForm.value.password),
    }
    return handleSave({
      api: () => api.create(result),
      cb: () => $message.success('用户添加成功'),
    })
  }
  else if (modalAction.value === 'setRole') {
    return handleSave({
      api: () => api.update(modalForm.value),
      cb: () => $message.success('授权成功'),
    })
  }
  else if (modalAction.value === 'reset') {
    return handleSave({
      api: () => api.resetPwd(modalForm.value.id, modalForm.value),
      cb: () => $message.success('密码重置成功'),
    })
  }
  handleSave()
}

function handleOpenRolesSet(row) {
  handleOpen({
    action: 'setRole',
    title: '分配权限',
    row: { userId: row.userId, userName: row.userName, role: row.role },
    onOk: onSave,
  })
}

function createUser() {
  handleOpen({
    action: 'add',
    title: '新增管理员',
    row: { userName: '', password: '' },
    onOk: onSave,
  })
}
</script>
