<template>
  <AppPage show-footer>
    <n-card>
      <n-space align="center">
        <n-avatar round :size="100" :src="userStore.avatar" />
        <div class="ml-20">
          <div class="flex items-center text-16">
            <span>账号:</span>
            <span class="ml-12 opacity-80">{{ userStore.userName }}</span>
            <n-button
              class="ml-32"
              type="primary"
              text
              @click="pwdModalRef.open()"
            >
              <i class="i-fe:edit mr-4" />
              修改密码
            </n-button>
          </div>
          <div class="mt-16 flex items-center">
            <n-button type="primary" ghost @click="avatarModalRef.open()">
              更改头像
            </n-button>
          </div>
        </div>
      </n-space>
    </n-card>

    <n-card class="mt-20" title="个人资料信息">
      <template #header-extra>
        <n-button type="primary" text @click="profileModalRef.open()">
          <i class="i-fe:edit mr-4" />
          修改资料
        </n-button>
      </template>

      <n-descriptions
        label-placement="left"
        :label-style="{ width: '200px', textAlign: 'center' }"
        :column="1"
        bordered
      >
        <n-descriptions-item label="昵称">
          {{ userStore.displayName }}
        </n-descriptions-item>
        <n-descriptions-item label="身份">
          {{ `【${userStore.userInfo?.identity ?? "未定"}】` }}
        </n-descriptions-item>
        <n-descriptions-item label="签名">
          {{ userStore.userInfo?.description }}
        </n-descriptions-item>
        <n-descriptions-item label="性别">
          {{
            genders.find((item) => item.value === userStore.userInfo?.gender)
              ?.label ?? "未知"
          }}
        </n-descriptions-item>
        <n-descriptions-item label="所属部门">
          {{ userStore.userInfo?.department }}
        </n-descriptions-item>
        <n-descriptions-item label="职级">
          {{ `P${userStore.userInfo?.level ?? "_"}` }}
        </n-descriptions-item>
        <n-descriptions-item label="邮箱">
          {{ userStore.userInfo?.email }}
        </n-descriptions-item>
      </n-descriptions>
    </n-card>

    <MeModal
      ref="avatarModalRef"
      width="420px"
      title="更改头像"
      :mask-closable="false"
      :on-close="handleAvatarClose()"
      :on-open="handleAvatarOpen()"
      @ok="handleAvatarSave()"
    >
      <UploadImage :default-list="avatarList" @upload-success="uploadSuccess" />
    </MeModal>

    <MeModal
      ref="pwdModalRef"
      title="修改密码"
      width="420px"
      @ok="handlePwdSave()"
    >
      <n-form
        ref="pwdFormRef"
        :model="pwdForm"
        label-placement="left"
        require-mark-placement="left"
      >
        <n-form-item label="原密码" path="oldPassword" :rule="required">
          <n-input
            v-model:value="pwdForm.oldPassword"
            type="password"
            placeholder="请输入原密码"
          />
        </n-form-item>
        <n-form-item label="新密码" path="newPassword" :rule="required">
          <n-input
            v-model:value="pwdForm.newPassword"
            type="password"
            placeholder="请输入新密码"
          />
        </n-form-item>
      </n-form>
    </MeModal>

    <MeModal
      ref="profileModalRef"
      title="修改资料"
      width="420px"
      @ok="handleProfileSave()"
    >
      <n-form ref="profileFormRef" :model="profileForm" label-placement="left">
        <n-form-item label="昵称" path="displayName">
          <n-input
            v-model:value="profileForm.displayName"
            placeholder="请输入昵称~"
          />
        </n-form-item>
        <n-form-item label="身份" path="identity">
          <n-input
            v-model:value="profileForm.identity"
            placeholder="请输入身份~"
          />
        </n-form-item>
        <n-form-item label="签名" path="description">
          <n-input
            v-model:value="profileForm.description"
            placeholder="写一段签名吧~"
          />
        </n-form-item>
        <n-form-item label="性别" path="gender">
          <n-select
            v-model:value="profileForm.gender"
            placeholder="请选择性别"
            clearable
            :options="genders"
          />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="profileForm.email" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item label="所属部门" path="department">
          <n-input
            v-model:value="profileForm.department"
            placeholder="请输入所属部门"
          />
        </n-form-item>
        <n-form-item label="职级" path="level">
          <n-input-number
            v-model:value="profileForm.level"
            clearable
            :precision="0"
            placeholder="请输入职级"
          />
        </n-form-item>
      </n-form>
    </MeModal>
  </AppPage>
</template>

<script setup>
import api from '@/api/user'
import { MeModal, UploadImage } from '@/components'
import { useConfig, useForm, useModal } from '@/composables'
import { useUserStore } from '@/store'
import { getUserInfo } from '@/store/helper'

const userStore = useUserStore()
const required = {
  required: true,
  message: '此为必填项',
  trigger: ['blur', 'change'],
}

const [pwdModalRef] = useModal()
const [pwdFormRef, pwdForm, pwdValidation] = useForm()

async function handlePwdSave() {
  await pwdValidation()
  await api.changePassword(pwdForm.value)
  $message.success('密码修改成功')
  refreshUserInfo()
}

const newAvatar = ref(userStore.avatar)
const [avatarModalRef] = useModal()
const avatarList = ref([])
async function handleAvatarSave() {
  if (!newAvatar.value) {
    $message.error('请上传头像')
    return false
  }
  await api.update({ userId: userStore.userId, avatar: newAvatar.value })
  $message.success('头像修改成功')
  refreshUserInfo()
}
// 打开头像上传框
function handleAvatarOpen() {
  avatarList.value = [{ status: 'finished', url: newAvatar }]
}
// 关闭头像上传框
function handleAvatarClose() {
  avatarList.value = []
}

// 上传成功,暂存新头像
function uploadSuccess(fileUrl) {
  newAvatar.value = fileUrl[0].url
}

const { genders } = useConfig()

const [profileModalRef] = useModal()
const [profileFormRef, profileForm, profileValidation] = useForm({
  userId: userStore.userId,
  displayName: userStore.displayName,
  gender: userStore.userInfo?.gender ?? '',
  department: userStore.userInfo?.department,
  email: userStore.userInfo?.email,
  identity: userStore.userInfo?.identity,
  description: userStore.userInfo?.description,
})
async function handleProfileSave() {
  await profileValidation()
  await api.update(profileForm.value)
  $message.success('资料修改成功')
  refreshUserInfo()
}

async function refreshUserInfo() {
  const user = await getUserInfo()
  userStore.setUser(user)
}
</script>
