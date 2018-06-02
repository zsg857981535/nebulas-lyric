import axios from 'axios'

const instance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {'Content-Type': 'application/json'}
})

instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Do something with response data
  return response.data
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

export default instance
