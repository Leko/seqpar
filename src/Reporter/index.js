// @flow
import Plain from './Plain'
import Markdown from './Markdown'

const reporters = {
  plain: Plain,
  markdown: Markdown,
}

export type ReporterType = $Keys<typeof reporters>

const get = (type: ReporterType): Reportable => reporters[type]

export default get
