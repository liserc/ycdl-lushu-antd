import api from './index'
import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: '/auth/oauth/token',
    method: 'post',
    headers: {
      'Authorization': 'Basic MjE1MzY1NDoxMjM0NTY='
    },
    data: parameter
  })
}

export function getSmsCaptcha (mobile, register) {
  return axios({
    url: '/auth/captcha/sms/' + mobile,
    method: 'get',
    headers: {
      'Authorization': 'Basic MjE1MzY1NDoxMjM0NTY='
    },
    params: { register }
  })
}

export function getInfo () {
  return axios({
    url: '/lushu/users/userdetails',
    method: 'get'
  })
}

export function logout (token) {
  return axios({
    url: '/auth/oauth/logout',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    method: 'delete'
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return axios({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}
