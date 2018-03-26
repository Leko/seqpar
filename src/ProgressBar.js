// @flow
import width from 'string-width'
import truncate from 'cli-truncate'
import Bar from 'ascii-progress'
import type { ProgressMessage } from './Message'
import Step from './Step'

export default class ProgressBar {
  bar: Bar

  constructor () {
    this.bar = new Bar({
      schema: ':groupid:message:spacer:spent',
      total: Infinity,
      blank: ' ',
    })
  }

  display (step: Step, message: ProgressMessage) {
    const groupid = `${step.id} `
    const spent = ` ${(message.spent / 1000).toFixed()}s`
    // $FlowFixMe(stdout-has-columns)
    const remain = process.stdout.columns - (width(groupid) + width(spent))
    const log = truncate(message.log, remain, { position: 'middle' })
    const spacer = ' '.repeat(remain - width(log))

    this.bar.update(0, {
      groupid,
      spent,
      message: log,
      spacer,
    })
  }

  async clear (): Promise<void> {
    this.bar.clear()
    this.bar.terminate()
  }
}
