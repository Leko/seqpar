// @flow
import assert from 'assert'
import EventEmitter from 'events'
import sinon from 'sinon'
import { describe, it } from 'mocha'
import { IDLE, ERROR, CONFIGURE, CONFIGURE_SUCCESS, EXECUTE_SUCCEESS, EXECUTE } from '../../src/Message'
import Config from '../../src/Config'
import Worker from '../../src/Worker'

describe('Worker', () => {
  describe('constructor', () => {
    it('must listen to `message` event', () => {
      const emitter = new EventEmitter()
      // $FlowFixMe(mock-worker)
      const worker = new Worker(emitter)
      assert.equal(emitter.listenerCount('message'), 1)
      assert.ok(worker instanceof Worker)
    })
  })
  describe('handleMessage', () => {
    it('must idle makes true', () => {
      const emitter = new EventEmitter()
      // $FlowFixMe(mock-worker)
      const worker = new Worker(emitter)
      const before = worker.idle
      worker.handleMessage({ type: IDLE })
      assert.equal(before, false)
      assert.equal(worker.idle, true)
    })
    it('must emit `idle` event', () => {
      const spy = sinon.spy()
      const emitter = new EventEmitter()
      // $FlowFixMe(mock-worker)
      const worker = new Worker(emitter)
      worker.once('idle', spy)
      worker.handleMessage({ type: IDLE })
      assert.ok(spy.calledOnce)
    })
  })
  describe('get id', () => {
    it('must returns worker id', () => {
      const expected = 354
      const emitter = new EventEmitter()
      // $FlowFixMe(force-assign-id)
      emitter.id = expected
      // $FlowFixMe(mock-worker)
      const worker = new Worker(emitter)

      assert.equal(worker.id, expected)
    })
  })
  describe('isIdle', () => {
    it('must returns true when idle property is true', () => {
      // $FlowFixMe(mock-worker)
      const worker = new Worker(new EventEmitter())
      worker.idle = true

      assert.ok(worker.isIdle())
    })
    it('must returns false when idle property is false', () => {
      // $FlowFixMe(mock-worker)
      const worker = new Worker(new EventEmitter())
      worker.idle = false

      assert.ok(!worker.isIdle())
    })
  })
  describe('waitFor', () => {
    it('must reject error event occured', (done) => {
      const emitter = new EventEmitter()
      // $FlowFixMe(mock-worker)
      const worker = new Worker(emitter)
      worker.waitFor('HOGE').then(
        () => done(new Error('Missing expected rejection')),
        () => done(null)
      )
      emitter.emit('error', new Error())
    })
    it('must reject type is error', (done) => {
      const emitter = new EventEmitter()
      // $FlowFixMe(mock-worker)
      const worker = new Worker(emitter)
      worker.waitFor('HOGE').then(
        () => done(new Error('Missing expected rejection')),
        () => done(null)
      )
      emitter.emit('message', { type: ERROR })
    })
    it('must resolve type is wanted', (done) => {
      const expected = 'HOGE'
      const emitter = new EventEmitter()
      // $FlowFixMe(mock-worker)
      const worker = new Worker(emitter)
      worker.waitFor(expected).then(
        () => done(null),
        done
      )
      emitter.emit('message', { type: expected })
    })
    it('must not remain event listener for `message` and `error`', (done) => {
      const expected = 'HOGE'
      const emitter = new EventEmitter()
      // $FlowFixMe(mock-worker)
      const worker = new Worker(emitter)
      worker.waitFor(expected)
        .then(() => {
          assert.equal(emitter.listenerCount('message') + 1, messageListeners)
          assert.equal(emitter.listenerCount('error') + 1, errorListeners)
          done()
        })
        .catch(done)

      const messageListeners = emitter.listenerCount('message')
      const errorListeners = emitter.listenerCount('error')
      emitter.emit('message', { type: expected })
    })
  })
  describe('configure', () => {
    it('must send message of configure', (done) => {
      const emitter = new EventEmitter()
      // $FlowFixMe(force-assign)
      emitter.send = () => {}
      const stub = sinon.stub(emitter, 'send')
      // $FlowFixMe(mock-worker)
      const worker = new Worker(emitter)
      const config = new Config({
        concurrency: 2,
        bail: false,
        colors: false,
        recursive: false,
        reporters: [],
        runtimes: {},
        tempDir: '',
      })
      worker.configure(config)
        .then(() => {
          assert.ok(stub.calledOnceWith({ type: CONFIGURE, config }))
          done()
        })
        .catch(done)
      emitter.emit('message', { type: CONFIGURE_SUCCESS })
    })
  })
  describe('execute', (done) => {
    it('must makes busy', (done) => {
      const emitter = new EventEmitter()
      // $FlowFixMe(force-assign)
      emitter.send = () => {}
      // $FlowFixMe(mock-worker)
      const worker = new Worker(emitter)
      worker.execute('')

      assert.ok(!worker.isIdle())
      done()
    })
    it('must seend exeecute message', (done) => {
      const emitter = new EventEmitter()
      // $FlowFixMe(force-assign)
      emitter.send = () => {}
      const stub = sinon.stub(emitter, 'send')
      // $FlowFixMe(mock-worker)
      const worker = new Worker(emitter)
      worker.execute('')
        .then(() => {
          assert.ok(stub.calledOnceWith({ type: EXECUTE, path: '' }))
          done()
        })
        .catch(done)
      emitter.emit('message', { type: EXECUTE_SUCCEESS })
    })
  })
})
