import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('UserInfo',{
    // 共享数据
    state: ()=>({
        user_info: {}, // 对象 account
    }),
    getters: {
    },
    actions: {
    }
})