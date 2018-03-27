// @flow
import assert from 'assert'
import { describe, it, before, after } from 'mocha'
import mockFS from 'mock-fs'
import { assertRejects } from '../utils/assert-promise'
import Config from '../../src/Config'
import FileMatcher from '../../src/FileMatcher'

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

describe('FileMatcher', () => {
  describe('match', () => {
    before(() => mockFS({
      'scripts': {
        'file1.sh': '',
        'dir2': {
          'file2.js': '',
        },
        'file3': '',
      },
    }))
    after(() => mockFS.restore())

    describe('Not recursive w/o glob', () => {
      it('must returns files, not includes directory', async () => {
        const config = getConfig({ recursive: false })
        const matcher = new FileMatcher(config)
        const files = await matcher.match('scripts')
        assert.deepEqual(files, ['scripts/file1.sh', 'scripts/file3'])
      })
      it('must throws Error when directory not exists', async () => {
        const config = getConfig({ recursive: false })
        const matcher = new FileMatcher(config)
        await assertRejects(() => matcher.match('not-exists-file'), /no such file or directory 'not-exists-file'/)
      })
    })
    describe('Not recursive with glob', () => {
      it('must returns files, not includes directory', async () => {
        const config = getConfig({ recursive: false })
        const matcher = new FileMatcher(config)
        const files = await matcher.match('scripts/**/*')
        assert.deepEqual(files.sort(), ['scripts/file1.sh', 'scripts/dir2/file2.js', 'scripts/file3'].sort())
      })
      it('must throws Error when directory not exists', async () => {
        const config = getConfig({ recursive: false })
        const matcher = new FileMatcher(config)
        await assertRejects(() => matcher.match('not-exists-dir/**/*'), /'not-exists-dir\/\*\*\/\*' is not found/)
      })
    })
    describe('recursive', () => {
      it('must returns files, not includes directory', async () => {
        const config = getConfig({ recursive: true })
        const matcher = new FileMatcher(config)
        const files = await matcher.match('scripts')
        assert.deepEqual(files.sort(), ['scripts/file1.sh', 'scripts/dir2/file2.js', 'scripts/file3'].sort())
      })
      it('must throws Error when directory not exists', async () => {
        const config = getConfig({ recursive: true })
        const matcher = new FileMatcher(config)
        await assertRejects(() => matcher.match('not-exists-dir'), /'not-exists-dir' is not found/)
      })
    })
  })
})
