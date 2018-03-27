// @flow
import assert from 'assert'
import sinon from 'sinon'
import { describe, it } from 'mocha'
import ProgressBar from '../../src/ProgressBar'
import ProgressBarManager from '../../src/ProgressBarManager'

describe('ProgressBarManager', () => {
  describe('get', () => {
    const bar1 = new ProgressBar()
    const bar2 = new ProgressBar()
    const manager = new ProgressBarManager([bar1, bar2])
    assert.strictEqual(manager.get(1), bar2)
  })
  describe('clear', () => {
    it('must call ProgressBar#clear', async () => {
      const bar = new ProgressBar()
      const stub = sinon.stub(bar, 'clear')
      const manager = new ProgressBarManager([bar])
      await manager.clear()
      assert.ok(stub.called)
    })
    it('must call ProgressBar#bar#cursor.reset', async () => {
      const bar = new ProgressBar()
      sinon.stub(bar, 'clear')
      const stub = sinon.stub(bar.bar.cursor, 'reset')
      const manager = new ProgressBarManager([bar])
      await manager.clear()
      assert.ok(stub.called)
    })
    it('must unlisten event `before:newlines`', async () => {
      const manager = new ProgressBarManager([])
      await manager.clear()
      assert.equal(process.stdout.listenerCount('before:newlines'), 0)
    })
  })
})
