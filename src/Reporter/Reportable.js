// @flow

interface Reportable {
  constructor (stream: stream$Readable) {

  }
}

Runner.run('target')
Worker.dispatch()
