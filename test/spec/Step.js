// @flow
import assert from 'assert'
import { describe, it } from 'mocha'
import Step from '../../src/Step'

describe('Step', () => {
  describe('static parseId', () => {
    it('can parse numerical ID even if starts 0', () => {
      assert.equal('012', Step.parseId('012_hoge.sh'))
    })
    it('can parse non numerical ID', () => {
      assert.equal('a-z', Step.parseId('a-z_hoge.sh'))
    })
  })
})
