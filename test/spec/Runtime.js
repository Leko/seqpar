// @flow
import assert from 'assert'
import { describe, it } from 'mocha'
import Runtime from '../../src/Runtime'

describe('Runtime', () => {
  describe('constructor', () => {
    it('can instantiate', () => {
      const runtime = new Runtime('sh')
      assert.equal(runtime.executable, 'sh')
    })
  })
})
