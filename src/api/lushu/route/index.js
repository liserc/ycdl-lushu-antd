import { axios } from '@/utils/request'

export function page (query) {
  return axios({
    url: '/system/lushu/routes/search',
    method: 'get',
    params: query
  })
}

export function loadRoute (id) {
  return axios({
    url: '/system/lushu/routes/details/' + id,
    method: 'get'
  })
}
