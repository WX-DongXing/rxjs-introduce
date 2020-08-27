import { v4 as uuid } from 'uuid'

export default class Log {
  constructor ({ type = 'info', sign = 'Log', content = '' }) {
    this.id = uuid()
    this.createTime = new Date().toLocaleString()
    this.type = type
    this.sign = sign
    this.content = content
  }
}
