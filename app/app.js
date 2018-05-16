
//use bluebird for performance
global.Promise = require('bluebird')

const {
  app, BrowserWindow, Menu,
  shell
} = require('electron')
const {fork} = require('child_process')
const _ = require('lodash')
const getConf = require('./config.default')
const os = require('os')
const {resolve} = require('path')
const ls = require('./lib/ls')
const version = require('./lib/version')
const menu = require('./lib/menu')
const {setWin} = require('./lib/win')
const log = require('electron-log')
const rp = require('phin').promisified

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let timer
let childPid
let {NODE_ENV} = process.env
const isDev = NODE_ENV === 'development'
const packInfo = require(isDev ? '../package.json' : './package.json')
const iconPath = resolve(
  __dirname,
  (isDev ? '../' : '') +
  'res/wx-logo.png'
)

function onClose() {
  clearTimeout(timer)
  win = null
  process.kill(childPid)
  setWin(win)
  process.exit(0)
}

async function waitUntilServerStart(url) {
  let serverStarted = false
  while (!serverStarted) {
    await rp({
      url,
      timeout: 100
    })
      .then(() => {
        serverStarted = true
      })
      .catch(() => null)
  }
}

log.info('App starting...')

async function createWindow () {

  let config = await getConf()

  //start server
  let child = fork(resolve(__dirname, './lib/server.js'), {
    env: Object.assign(
      {},
      process.env,
      _.pick(config, ['port', 'host'])
    ),
    cwd: process.cwd()
  }, (error, stdout, stderr) => {
    if (error || stderr) {
      throw error || stderr
    }
    log.info(stdout)
  })

  childPid = child.pid

  if (config.showMenu) Menu.setApplicationMenu(menu)

  // const {width, height} = require('electron').screen.getPrimaryDisplay().workAreaSize

  // Create the browser window.
  win = new BrowserWindow({
    fullscreenable: true,
    fullscreen: true,
    icon: iconPath
  })

  win.setAutoHideMenuBar(true)

  global.et = {}
  Object.assign(global.et, {
    autoVisitTime: config.timer,
    _config: config,
    ls,
    resolve,
    version,
    env: process.env,
    openExternal: shell.openExternal,
    homeOrtmp: os.homedir() || os.tmpdir(),
    toggleFullscreen: () => {
      let isfull = win.isFullScreen()
      win.setFullScreen(!isfull)
    },
    openDevTools: () => {
      win.webContents.openDevTools()
    },
    closeApp: () => {
      win.close()
    },
    restart: () => {
      win.close()
      app.relaunch()
    },
    rp,
    packInfo,
    os
  })

  let opts = `http://localhost:${config.port}/index.html`
  let childServerUrl = opts + ''
  if (isDev) {
    let conf = require('../config.default')
    opts = `http://localhost:${conf.devPort}`
  }

  await waitUntilServerStart(childServerUrl)

  win.loadURL(opts)
  win.maximize()

  // Open the DevTools.
  if(isDev) win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('close', onClose)

  setWin(win)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', onClose)

app.on('activate', () => {

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
