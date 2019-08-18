import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 6000 // 请求超时时间
})

/**
 * 请求拦截器
 */
service.interceptors.request.use(
  config => {
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (token) {
      // 让每个请求携带自定义 token
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    console.log(error) // for debug
    notification.error({
      message: '请求异常',
      description: error
    })
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
service.interceptors.response.use(
  response => {
    const data = response.data
    const { code, msg } = data
    const description = '【' + code + '】' + msg
    if (code !== 0) {
      notification.error({
        message: '业务异常',
        description: description
      })
      return Promise.reject(data)
    }
    return response.data
  },
  error => {
    const { code, message, config: { url } } = error
    const { status, data } = error.response
    const { msg } = data
    const description = '【' + code + '】' + msg
    if (code === 'ECONNABORTED' && message.indexOf('timeout')) {
      notification.error({
        message: '网络连接超时',
        description: url
      })
    }

    switch (status) {
      case 401:
        notification.error({
          message: '未认证',
          description: msg
        })
        const token = Vue.ls.get(ACCESS_TOKEN)
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      case 403:
        notification.error({
          message: '拒绝访问',
          description: url
        })
        break
      case 404:
        notification.error({
          message: '请求地址错误',
          description: url
        })
        break
      case 500:
        notification.error({
          message: '系统异常',
          description: description
        })
        break
      case 503:
        notification.error({
          message: '服务异常',
          description: '请稍后重试'
        })
        break
      default:
        notification.error({
          message: '999',
          description: '请稍后重试'
        })
        break
    }
    return Promise.reject(error)
  }
)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
