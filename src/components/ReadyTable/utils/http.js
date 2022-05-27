import axios from 'axios'
import { Message } from 'element-ui'
import { isUrl } from "./index"

// create an axios instance
const service = axios.create({
  baseURL: '',
  withCredentials: false,
})

// request interceptor
service.interceptors.request.use(
  config => {
    const baseUrl = sessionStorage.getItem("base-url");
    if (!isUrl(config.url) && baseUrl) config.baseURL = baseUrl;
    const authKey = sessionStorage.getItem("auth-key");
    const authValue = sessionStorage.getItem("auth-value");
    if (authKey == "" || authValue == "") {
      Message({
        message: '无法请求数据，token未定义',
        type: 'error'
      })
      return Promise.reject('无法请求数据，token未定义')
    }
    config.headers[authKey] = authValue;
    return config;
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(response => {
  if (response.status != 200) {
    return Promise.reject(new Error(res.msg || 'Error'))
  }
  return response.data
},
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
