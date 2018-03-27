// @flow
import assert from 'assert'
import { describe, it } from 'mocha'
import Config from '../../src/Config'

describe('Config', () => {
  describe('getRuntime', () => {
    it('must return specified runtime when mapping exists', () => {
      const config = new Config({
        concurrency: 1,
        bail: true,
        colors: false,
        recursive: false,
        reporters: [],
        tempDir: '',
        runtimes: {
          'js': 'babel-node',
        },
      })
      assert.equal('babel-node', config.getRuntime('js').executable)
    })
    it('must return default runtime when mapping not exists', () => {
      const config = new Config({
        concurrency: 1,
        bail: true,
        colors: false,
        recursive: false,
        reporters: [],
        tempDir: '',
        runtimes: { '': 'sh' },
      })
      assert.equal('sh', config.getRuntime('xxx').executable)
    })
  })
})
