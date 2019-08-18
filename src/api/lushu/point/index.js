import { axios } from '@/utils/request'

export function search (query) {
  return axios({
    url: '/system/lushu/points/search',
    // url: '/system/lushu/points/search?ELat=26.4074734&ELng=106.632935&SLat=26.40747354&SLng=106.632935&keyword=%E8%8A%B1%E6%BA%AA&range=50',
    method: 'get',
    params: query
  })
}

export function details (id) {
  return axios({
    url: '/lushu/points/details/' + id,
    method: 'get'
  })
}

export function getObj (id) {
  return axios({
    url: '/lushu/api/images/' + id,
    method: 'get'
  })
}

export const detailsJson = { 'routId': '3',
  'pointId': '10',
  'nickName': 'Super Loser',
  'avatar': 'http://ycdl.oss-cn-shenzhen.aliyuncs.com/lushu/user/10/avatar/26d4bbdfc859c8eacff2a326e7cd53be.png',
  'name': 'X122(花燕路)-思雅路',
  'type': 1,
  'record': 0,
  'snapshot': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/snapshot/20190626/cbc103ee132a42b17d99387de953297f.png',
  'drop': 28.78,
  'mileage': 3405.690782254192,
  'use': '2558910',
  'start': '1560496836377',
  'end': '1560499395287',
  'uptime': null,
  'praise': 1,
  'collection': 0,
  'comment': 85,
  'medias': 18,
  'keypoints': [
    {
      'pointId': 'a8eukGsB-9CAMZoIpjvt',
      'name': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/images/20190626/b905ab1a5f5dff70a0a3173aae808f1d.jpg',
      'type': 2,
      'explain': '',
      'time': '1560496859498',
      'lng': 106.6371368172139,
      'lat': 26.386965159241175,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': 'X122(花燕路)'
    },
    {
      'pointId': 'bMeukGsB-9CAMZoIpjvt',
      'name': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/video/20190626/00096c688b6bde0bd5e17e7bb38fd2f5.mp4',
      'type': 4,
      'explain': '',
      'time': '1560496988436',
      'lng': 106.6379250834218,
      'lat': 26.388115410915074,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': 'X122(花燕路)'
    },
    {
      'pointId': 'bceukGsB-9CAMZoIpjvt',
      'name': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/images/20190626/2581a9eff72da7e60d87332c9eb35135.jpg',
      'type': 2,
      'explain': '',
      'time': '1560497140729',
      'lng': 106.63895321925341,
      'lat': 26.389856438996535,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': 'X122(花燕路)'
    },
    {
      'pointId': 'bseukGsB-9CAMZoIpjvt',
      'name': '洛平服务中心',
      'type': 5,
      'explain': '十字路口',
      'time': '1560497359367',
      'lng': 106.64023428100398,
      'lat': 26.39206973408203,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': 'X122(花燕路)'
    },
    {
      'pointId': 'b8eukGsB-9CAMZoIpjvt',
      'name': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/voice/20190626/d723f174fd9ef2b9d7b275ad2e4dc93d.mp3',
      'type': 3,
      'explain': '',
      'time': '1560497502137',
      'lng': 106.6396234983739,
      'lat': 26.39301451126845,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思杨路'
    },
    {
      'pointId': 'cMeukGsB-9CAMZoIpjvt',
      'name': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/voice/20190626/6475f3a798d5d071dc791e21bd728c18.mp3',
      'type': 3,
      'explain': '',
      'time': '1560497744057',
      'lng': 106.63631707183023,
      'lat': 26.393820747722835,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思杨路'
    },
    {
      'pointId': 'cceukGsB-9CAMZoIpjvt',
      'name': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/images/20190626/7f2d60829bc44b320df1c05a80298609.jpg',
      'type': 2,
      'explain': '',
      'time': '1560497806824',
      'lng': 106.63546380396694,
      'lat': 26.394022236769313,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思杨路'
    },
    {
      'pointId': 'cseukGsB-9CAMZoIpjvt',
      'name': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/video/20190626/028e4ac2a4b1e8c64409cd3375af73e4.mp4',
      'type': 4,
      'explain': '',
      'time': '1560497876094',
      'lng': 106.6347397421594,
      'lat': 26.394230405745684,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思杨路'
    },
    {
      'pointId': 'c8eukGsB-9CAMZoIpjvt',
      'name': '明德学院',
      'type': 5,
      'explain': '后山下',
      'time': '1560498060068',
      'lng': 106.6329453006618,
      'lat': 26.395805029414387,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思杨路'
    },
    {
      'pointId': 'dMeukGsB-9CAMZoIpjvt',
      'name': '明德学院',
      'type': 5,
      'explain': '十字路口',
      'time': '1560498390270',
      'lng': 106.62906458320381,
      'lat': 26.3976125667546,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思杨路'
    },
    {
      'pointId': 'dceukGsB-9CAMZoIpjvt',
      'name': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/images/20190626/8fed5e5100a3626013661536bce49011.jpg',
      'type': 2,
      'explain': '',
      'time': '1560498550210',
      'lng': 106.62717004499825,
      'lat': 26.398431412023093,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思雅路'
    },
    {
      'pointId': 'dseukGsB-9CAMZoIpjvt',
      'name': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/images/20190626/2187d522274a136e4310f7232c9cb5c6.jpg',
      'type': 2,
      'explain': '',
      'time': '1560498625702',
      'lng': 106.62677917420179,
      'lat': 26.399196455924212,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思雅路'
    },
    {
      'pointId': 'd8eukGsB-9CAMZoIpjvt',
      'name': '明德学院',
      'type': 5,
      'explain': '正大门',
      'time': '1560498659689',
      'lng': 106.62658173632242,
      'lat': 26.399586453012578,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思雅路'
    },
    {
      'pointId': 'eMeukGsB-9CAMZoIpjvt',
      'name': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/video/20190626/451269aed21899a0dba89468bc734b43.mp4',
      'type': 4,
      'explain': '',
      'time': '1560498740973',
      'lng': 106.62634693778573,
      'lat': 26.400319822826834,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思雅路'
    },
    {
      'pointId': 'eceukGsB-9CAMZoIpjvt',
      'name': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/voice/20190626/0c1a321806b21f97173bc49d4d2b21d8.mp3',
      'type': 3,
      'explain': '',
      'time': '1560498845736',
      'lng': 106.6259314453081,
      'lat': 26.40169991564725,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思雅路'
    },
    {
      'pointId': 'eseukGsB-9CAMZoIpjvt',
      'name': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/images/20190626/811b0fba9e6c7377c93822f84b87bad9.jpg',
      'type': 2,
      'explain': '',
      'time': '1560499068343',
      'lng': 106.62520567159649,
      'lat': 26.404303746479385,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思雅路'
    },
    {
      'pointId': 'e8eukGsB-9CAMZoIpjvt',
      'name': '数字经济产业园',
      'type': 5,
      'explain': '记录达四十分钟',
      'time': '1560499286671',
      'lng': 106.62436618581684,
      'lat': 26.406740036675014,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思雅路'
    },
    {
      'pointId': 'fMeukGsB-9CAMZoIpjvt',
      'name': 'http://duanly.oss-cn-shenzhen.aliyuncs.com/lushu/route/10/images/20190626/91b6473c86dd9843316fb623b729bb26.jpg',
      'type': 2,
      'explain': '',
      'time': '1560499358111',
      'lng': 106.62373114686376,
      'lat': 26.40692596158047,
      'country': '中国',
      'province': '贵州省',
      'city': '贵阳市',
      'district': '花溪区',
      'street': '思雅路'
    }
  ]
}
