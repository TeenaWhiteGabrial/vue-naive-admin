import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
  }),
  getters: {
    userId() {
      return this.userInfo?.userId
    },
    userName() {
      return this.userInfo?.userName
    },
    displayName() {
      return this.userInfo?.displayName
    },
    avatar() {
      return this.userInfo?.avatar
    },
    department() {
      return this.userInfo?.department
    },
    currentRole() {
      return this.userInfo?.currentRole || {}
    },
    identity() {
      return this.userInfo?.identity
    },
    gender() {
      return this.userInfo?.gender
    },
    roles() {
      return this.userInfo?.roles || []
    },
    description() {
      return this.userInfo?.description
    },
  },
  actions: {
    setUser(user) {
      this.userInfo = user
    },
    resetUser() {
      this.$reset()
    },
  },
})
