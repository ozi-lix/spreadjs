/**
 * index
 * @author oldj
 * @blog https://oldj.net
 */

'use strict'

// const path = require('path')
// const execFile = require('child_process').execFile
// const bin = path.join(__dirname, 'fontlist').replace('app.asar', 'app.asar.unpacked')

// const font_exceptions = ['iconfont']

function tryToGetFonts (s) {
  let fonts = []
  let m = s.match(/\([\s\S]+?\)/)
  if (m) {
    let a = m[0].replace(/\(|\)/g, '').split('\n')
    fonts = fonts.concat(a.map(i => {
      return i.replace(/^\s+|\s+$/g, '').replace(/\,$/, '')
    }))
  }

  return fonts
}

module.exports = () => new Promise((resolve, reject) => {
  const fontManager = require('./font-manager/font-manager');
  fontManager.getAvailableFonts((fonts) => {
    if (!fonts) {
      reject(null);
    }
    var uniqueFontFamilies = {};
    fonts.forEach((font) => {
      var fontFamily = font.family;
      if (!uniqueFontFamilies[fontFamily]) {
        font.filter = true;
        uniqueFontFamilies[fontFamily] = true;
      }
    });
    var fontFamilies = fonts.filter((f)=>{
      return f.filter;
    }).map((f) => {
      return {
        fontLocalizedName: f.family,
        fontOriginName: f.postscriptName
      }
    });
    fontFamilies.sort((font1, font2) => {
      return (font1.fontLocalizedName < font2.fontLocalizedName) ? -1 : 1;
    });
    // var resultMap = {};
    // fontFamilies.forEach((family) => {
    //     resultMap[family] = true;
    // });
    // resolve(Object.keys(resultMap));
    resolve(fontFamilies);
  });
  // execFile(bin, (error, stdout, stderr) => {
  //   if (error) {
  //     reject(error)
  //     return
  //   }

  //   let fonts = []
  //   if (stdout) {
  //     fonts = fonts.concat(tryToGetFonts(stdout))
  //   }
  //   if (stderr) {
  //     fonts = fonts.concat(tryToGetFonts(stderr))
  //   }

  //   let dict = {}
  //   fonts.map(i => {
  //     if (i) {
  //       dict[i] = 1
  //     }
  //   })
  //   fonts = []
  //   for (let k in dict) {
  //     if (dict.hasOwnProperty(k) && k !== 'iconfont') {
  //       fonts.push(k)
  //     }
  //   }
  //   fonts.sort()
  //   resolve(fonts)
  // })
})
