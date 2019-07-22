import { axios } from '@/utils/request'

export function getUserdetails (userId) {
  return axios({
    url: '/lushu/users/userdetails/' + userId,
    method: 'get'
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
