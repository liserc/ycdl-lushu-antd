import { axios } from '@/utils/request'

export function queryComment (id) {
  return axios({
    url: '/system/lushu/routes/comments/' + id,
    method: 'get'
  })
}

export function postComment (data) {
  return axios({
    url: '/system/lushu/routes/comments/',
    method: 'post',
    data: data
  })
}

export function postCommentReply (data) {
  return axios({
    url: '/system/lushu/routes/comments/reply',
    method: 'post',
    data: data
  })
}

export function getCollection (userId) {
  let url
  if (userId) {
    url = '/lushu/routes/socials/details/' + userId
  } else {
    url = '/lushu/routes/socials/details'
  }
  return axios({
    url: url,
    method: 'get'
  })
}
