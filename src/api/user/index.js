import { axios } from '@/utils/request'

export function getUserdetails (userId) {
  return axios({
    url: '/lushu/users/userdetails/' + userId,
    method: 'get'
  })
}

export function postUser (parameter) {
  return axios({
    url: '/lushu/users/registration',
    method: 'post',
    data: parameter
  })
}

export function putObj (parameter) {
  return axios({
    url: '/lushu/users',
    method: 'put',
    data: parameter
  })
}

/**
 * 上传用户头像
 * @param user
 * @param parameter
 * @returns {*}
 */
export function uploadTheAvatar (user, parameter) {
  return axios({
    url: '/lushu/users/avatars/' + user,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: parameter
  })
}

export function putAccountPassword (parameter) {
  return axios({
    url: '/lushu/users/account/password',
    method: 'put',
    data: parameter
  })
}

export function getAccountBind () {
  return axios({
    url: '/lushu/users/account/bind',
    method: 'get'
  })
}

export function postAccountBind (parameter) {
  return axios({
    url: '/lushu/users/account/bind',
    method: 'post',
    data: parameter
  })
}

export function deleteAccountBind (parameter) {
  return axios({
    url: '/lushu/users/account/bind',
    method: 'delete',
    data: parameter
  })
}
