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

export function getCollection () {
  return axios({
    url: '/system/lushu/routes/socials/details',
    method: 'get'
  })
}
