const { Application } = require('spectron')
const electronPath = require('electron')
const {resolve} = require('path')
const delay = require('./common/wait')
const {expect} = require('chai')
const cwd = process.cwd()
const {log} = console

describe('main window', function () {
  this.timeout(100000)

  beforeEach(async function() {
    this.app = new Application({
      path: electronPath,
      args: [resolve(cwd, 'work/app')]
    })
    return this.app.start()
  })

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('should open window and buttons works', async function() {
    const { client } = this.app

    await client.waitUntilWindowLoaded()
    await delay(500)

    log('elements')
    let wrap = await client.element('#container')
    expect(!!wrap.value).equal(true)

  })

})
