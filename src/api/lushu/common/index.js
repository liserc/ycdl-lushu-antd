import { axios } from '@/utils/request'

export function queryComment (id) {
  return axios({
    url: '/lushu/routes/comments/' + id,
    method: 'get'
  })
}

export function postComment (data) {
  return axios({
    url: '/lushu/routes/comments/',
    method: 'post',
    data: data
  })
}

export function postCommentReply (data) {
  return axios({
    url: '/lushu/routes/comments/reply',
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

export function getSocialStatus (id) {
  return axios({
    url: '/lushu/routes/socials/status/' + id,
    method: 'get'
  })
}

export function postSocial (data) {
  return axios({
    url: '/lushu/routes/socials',
    method: 'post',
    data: data
  })
}

export function deleteSocial (data) {
  return axios({
    url: '/lushu/routes/socials',
    method: 'delete',
    data: data
  })
}
