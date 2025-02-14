/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict'

const platform = process.platform

exports.getFonts = () => Promise.resolve().then(() => {
  try {
    if (platform === 'darwin') {
      const for_darwin = require('./libs/darwin/index')
      return for_darwin()
  
    } else if (platform === 'win32') {
      const for_win32 = require('./libs/win32/index')
      return for_win32()
  
    } else if (platform === "linux") {
      const for_linux = require("./libs/linux/index");
      return for_linux();
    } else {
      return Promise.reject(`Error: font-list not support on ${platform}.`)
    }
  } catch {
    return Promise.reject(null)
  }
  
})
