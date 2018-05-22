/**
 * app system menu config
 */
const {app, Menu} = require('electron')
const {prefix} = require('./locales')
const e = prefix('menu')
const c = prefix('control')

const template = [
  {
    label: e('edit'),
    submenu: [
      {
        label: c('newSsh'),
        click () {
          require('./win').win.webContents.send('new-ssh', null)
        }
      },
      {role: 'undo', label: e('undo')},
      {role: 'redo', label: e('redo')},
      {type: 'separator'},
      {role: 'cut', label: e('cut')},
      {role: 'copy', label: e('copy')},
      {role: 'paste', label: e('paste')},
      {role: 'pasteandmatchstyle', label: e('pasteandmatchstyle')},
      {role: 'delete', label: e('del')},
      {role: 'selectall', label: e('selectall')}
    ]
  },
  {
    label: e('view'),
    submenu: [
      {role: 'reload', label: e('reload')},
      {role: 'forcereload', label: e('forcereload')},
      {role: 'toggledevtools', label: e('toggledevtools')},
      {
        label: e('toggleControl'),
        click () {
          require('./win').win.webContents.send('toggle-control', null)
        }
      },
      {type: 'separator'},
      {role: 'resetzoom', label: e('resetzoom')},
      {role: 'zoomin', label: e('zoomin')},
      {role: 'zoomout', label: e('zoomout')},
      {type: 'separator'},
      {role: 'togglefullscreen', label: e('togglefullscreen')}
    ]
  },
  {
    role: 'window',
    label: e('window'),
    submenu: [
      {role: 'minimize', label: e('minimize')},
      {role: 'close', label: e('close')}
    ]
  },
  {
    role: 'help',
    label: e('help'),
    submenu: [
      {
        label: e('toggledevtools'),
        click() {
          require('./win').win.webContents.openDevTools()
        }
      },
      {
        label: '重置用户名/密码/大屏链接',
        click() {
          require('./win').win.resetForm()
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide', label: e('hide')},
      {role: 'hideothers', label: e('hideothers')},
      {role: 'unhide', label: e('unhide')},
      {type: 'separator'},
      {role: 'quit', label: e('quit')}
    ]
  })

  // Edit menu
  template[1].submenu.push(
    {type: 'separator'},
    {
      label: 'Speech',
      submenu: [
        {role: 'startspeaking', label: e('startspeaking')},
        {role: 'stopspeaking', label: e('stopspeaking')}
      ]
    }
  )

  // Window menu
  template[3].submenu = [
    {role: 'close', label: e('close')},
    {role: 'minimize', label: e('minimize')},
    {role: 'zoom', label: e('zoom')},
    {type: 'separator'},
    {role: 'front', label: e('front')}
  ]
}

const menu = Menu.buildFromTemplate(template)

module.exports = menu
