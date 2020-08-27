import Axios from 'axios'

const request = Axios.create({
  baseURL: 'http://httpbin.org',
  timeout: 30000,
  headers: {
    Accept: 'application/vnd.github.v3+json'
  }
})

export default request
