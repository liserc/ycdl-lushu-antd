import REGION_DATA from 'china-area-data'

const areaCode = REGION_DATA['86']

/**
 * 加载省级编码
 * @returns {Array}
 * @constructor
 */
function LoadProvinceCode () {
  const province = []
  for (const prop in areaCode) {
    province.push({
      value: prop, // 省份code值
      label: areaCode[prop] // 省份汉字
    })
  }
  // 添加'全部'选项
  province.unshift({
    value: '',
    label: '全部'
  })
  return province
}

/**
 * 加载市级编码
 * @param provinceCode 省级编码
 * @returns {Array}
 * @constructor
 */
function LoadCityCode (provinceCode) {
  const city = []
  for (const prop in REGION_DATA[provinceCode]) {
    city.push({
      value: prop,
      label: REGION_DATA[provinceCode][prop]
    })
  }
  // 添加'全部'选项
  city.unshift({
    value: '',
    label: '全部'
  })
  return city
}

/**
 * 省市级联
 */
function ProvinceAndCityCascades () {
  const province = []
  for (const prop in areaCode) {
    province.push({
      key: prop,
      value: areaCode[prop], // 省份code值
      label: areaCode[prop] // 省份汉字
    })
  }

  province.forEach(item => {
    const city = []
    for (const prop in REGION_DATA[item.key]) {
      city.push({
        key: prop,
        value: REGION_DATA[item.key][prop],
        label: REGION_DATA[item.key][prop]
      })
    }
    item.children = city
  })

  return province
}

export {
  LoadProvinceCode,
  LoadCityCode,
  ProvinceAndCityCascades
}
