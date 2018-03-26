// @flow
import assert from 'assert'
import sinon from 'sinon'
import { describe, it, before, after } from 'mocha'
import mockFS from 'mock-fs'
import Scenario from '../../src/Scenario'
import Config from '../../src/Config'
import Step from '../../src/Step'

const getConfig = (overrides = {}) => new Config({
  recursive: false,
  bail: true,
  colors: true,
  reporters: [],
  runtimes: {},
  tempDir: '',
  concurrency: 1,
  ...overrides,
})

describe('Scenario', () => {
  before(() => mockFS({
    'scripts': {
      '000_file1.sh': '',
      '003_file4': '',
      'dir2': {
        '000_file2.js': '',
      },
      '001_file3': '',
    },
  }))
  after(() => mockFS.restore())

  describe('static create', () => {
    it('must returns Scenario group by file prefix', async () => {
      const config = getConfig({ recursive: false })
      const scenario = await Scenario.create('scripts/**/*', config)
      assert.deepEqual(scenario.steps, [
        // $FlowFixMe(it-is-valid-StepID)
        new Step('000', ['scripts/000_file1.sh', 'scripts/dir2/000_file2.js']),
        // $FlowFixMe(it-is-valid-StepID)
        new Step('001', ['scripts/001_file3']),
        // $FlowFixMe(it-is-valid-StepID)
        new Step('003', ['scripts/003_file4']),
      ])
    })
    it('must returns Scenario ordered in file prefix', async () => {
      const config = getConfig({ recursive: true })
      const scenario = await Scenario.create('scripts', config)
      assert.deepEqual(scenario.steps, [
        // $FlowFixMe(it-is-valid-StepID)
        new Step('000', ['scripts/000_file1.sh', 'scripts/dir2/000_file2.js']),
        // $FlowFixMe(it-is-valid-StepID)
        new Step('001', ['scripts/001_file3']),
        // $FlowFixMe(it-is-valid-StepID)
        new Step('003', ['scripts/003_file4']),
      ])
    })
  })
})
