import { basePermissions } from '@/settings'
import api from '@/api'

export async function getUserInfo() {
  const res = await api.getUser()
  const { userId, userName, avatar, displayName, department, role }
    = res.data || {}
  return {
    userId,
    userName,
    avatar,
    displayName,
    department,
    role,
  }
}

export async function getPermissions() {
  let asyncPermissions = []
  try {
    const res = await api.getRolePermissions()
    asyncPermissions = res?.data || []
  }
  catch (error) {
    console.error(error)
  }
  return basePermissions.concat(asyncPermissions)
}
