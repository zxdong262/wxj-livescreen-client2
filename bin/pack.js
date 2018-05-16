/**
 * pack
 */

const {version} = require('../package.json')
const {exec, echo} = require('shelljs')
const dir = 'dist/v' + version
const bin = './node_modules/.bin'

echo('start pack')

const timeStart = + new Date()

echo('building linux')
exec(`${bin}/electron-packager ./work/app --overwrite --platform=linux --arch=x64 --out=${dir}`)

const endTime = +new Date()
echo(`done pack in ${(endTime - timeStart)/1000} s`)
