import axios from 'axios'
import router from '../router'

axios.defaults.timeout = 5000 // 5秒超时
axios.defaults.withCredentials = true // 允许跨域
// Context-type 响应头
axios.defaults.headers.post['Context-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 基础url
axios.defaults.baseURL = 'http://localhost:8080'

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 如果 response里面的status是200,说明访问到接口了,否则访问错误
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 401: // 未登录
          router.replace({
            path: '/',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          break
        case 404:
          break // 未找到页面资源
      }
      return Promise.reject(error.response)
    }
  }
)

/**
 * 封装get方法
 */
export function get (url, params = {}) {
  return new Promise(
    (resolve, reject) => {
      axios.get(url, {params: params})
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
}

/**
 * 封装post方法
 */
export function post (url, data = {}) {
  return new Promise(
    (resolve, reject) => {
      axios.post(url, data)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
}
