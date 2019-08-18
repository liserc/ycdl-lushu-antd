import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    loadedUserDetails: false,
    userId: '',
    nickname: '',
    avatar: '',
    roles: [],
    userdetails: {},
    welcome: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NICKNAME: (state, { name, welcome }) => {
      state.nickname = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERDETAILS: (state, data) => {
      // 已加载完用户信息
      state.loadedUserDetails = true
      state.userId = data.userId
      state.userdetails = data
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const { data } = response
          Vue.ls.set(ACCESS_TOKEN, data.access_token, Number(data.expires_in) * 1000)
          commit('SET_TOKEN', data.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserDetails ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const { data } = response
          const { nickName, avatar } = data
          commit('SET_ROLES', ['ROLE_USER'])
          commit('SET_NICKNAME', { name: nickName, welcome: welcome() })
          commit('SET_AVATAR', avatar)
          commit('SET_USERDETAILS', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        const { token } = state
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)
        logout(token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user
