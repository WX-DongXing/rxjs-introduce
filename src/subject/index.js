import { Subject } from 'rxjs'

export default class Logger {
  constructor () {
    if (!Logger.instance) {
      this.obs = new Subject()
      Logger.instance = this
    }
    return Logger.instance
  }

  emit (message) {
    this.obs.next(message)
  }
}
