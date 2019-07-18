import { axios } from '@/utils/request'

export function search (query) {
  return axios({
    url: '/system/lushu/points/search?ELat=26.4074734&ELng=106.632935&SLat=26.40747354&SLng=106.632935&keyword=%E8%8A%B1%E6%BA%AA&range=50',
    // url: '/system/lushu/points/search?keyword=花溪',
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

export function getObj (id) {
  return axios({
    url: '/lushu/api/images/' + id,
    method: 'get'
  })
}
