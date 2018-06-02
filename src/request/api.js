import request from './axios-default'

const prefix = '/api'
const API = {
  'search': `${prefix}/search`, // get 关键词搜索 query { keywords, limit, offset }
  'lyric': `${prefix}/lyric` // get 搜索歌词 query { id }
}
const queryString = (data = {}) => {
  if (!Object.keys(data)) return

  let str = '?'
  for (let k in data) {
    let v = data[k]
    v !== '' && (str += `${k}=${encodeURIComponent(v)}&`)
  }
  str = str.replace(/&$/, '')
  return str
}
export default {
  searchByKeywords (data = { keywords: '', limit: '10', offset: '' }) {
    return request.get(`${API.search}${queryString(data)}`)
  },

  getLyricById (data = { id: '' }) {
    return request.get(`${API.lyric}${queryString(data)}`)
  }
}
