import axios from 'axios'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  method: 'POST',
  baseURL: process.env.BASE_API,
  timeout: 15000
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (!config.data) {
      config.data = {}
    }
    config.data = qs.stringify(config.data)
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // response => response,
  response => {
    const resContent = response.data
    const { code, msg, data } = resContent
    switch (code) {
      case -2:
        return Promise.reject(msg)
    }

    return data
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
