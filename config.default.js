const os = require('os')
const extend = require('recursive-assign')
let config = {

  site: {

    env: process.env.NODE_ENV || 'development',

    siteName: '无限极产品大屏专用客户端'

  },

  test: false,
  host: '0.0.0.0',
  port: process.env.PORT || 4590,
  devCPUCount: os.cpus().length,
  pkg: require('./package'),
  devPort: 5590
}

try {
  extend(config, require('./config.js'))
} catch (e) {
  console.log(e.stack)
  console.warn('warn:no custom config file, use "cp config.sample.js config.js" to create one')
}

module.exports = config



