'use strict'
const config = require('./index')
module.exports = () => {
  console.group('==========================')
  Object.keys(config).forEach(element => {
    typeof (config[element]) === 'undefined' && console.warn('error : ', element, '[x]')
  })
  console.groupEnd('==========================')
  console.log('completed')
}
