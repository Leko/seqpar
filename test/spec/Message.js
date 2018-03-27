// @flow
import assert from 'assert'
import { describe, it } from 'mocha'
import Config from '../../src/Config'
import {
  IDLE,
  ERROR,
  EXECUTE,
  EXECUTE_SUCCEESS,
  CONFIGURE,
  CONFIGURE_SUCCESS,
  PROGRESS,
  idle,
  error,
  execute,
  executed,
  configure,
  configured,
  progress,
} from '../../src/Message'

describe('Message', () => {
  describe('idle', () => {
    it('must return object contains type', () => {
      const message = idle()
      assert.equal(message.type, IDLE)
    })
  })
  describe('error', () => {
    it('must return object contains type', () => {
      const message = error(new Error())
      assert.equal(message.type, ERROR)
    })
  })
  describe('execute', () => {
    it('must return object contains type', () => {
      const message = execute('')
      assert.equal(message.type, EXECUTE)
    })
  })
  describe('executed', () => {
    it('must return object contains type', () => {
      const message = executed({ path: '', exitCode: 0, signal: '', pid: 0, spentTime: 0, stdoutLog: '', stderrLog: '' })
      assert.equal(message.type, EXECUTE_SUCCEESS)
    })
  })
  describe('configure', () => {
    it('must return object contains type', () => {
      const message = configure(new Config({
        recursive: false,
        bail: true,
        colors: true,
        reporters: [],
        runtimes: {},
        tempDir: '',
        concurrency: 1,
      }))
      assert.equal(message.type, CONFIGURE)
    })
  })
  describe('configured', () => {
    it('must return object contains type', () => {
      const message = configured()
      assert.equal(message.type, CONFIGURE_SUCCESS)
    })
  })
  describe('progress', () => {
    it('must return object contains type', () => {
      const message = progress({ workerId: 0, log: '', spent: 0 })
      assert.equal(message.type, PROGRESS)
    })
  })
})
