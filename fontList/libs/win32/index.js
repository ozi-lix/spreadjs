/**
 * index
 * @author oldj
 * @blog https://oldj.net
 */

'use strict'

// const path = require('path')
// const iconv = require('iconv-lite'); // now need the iconv-lite dependency in electron
const exec = require('child_process').exec

function tryToGetFonts(s) {
    let a = s.split('\n')
    if (a[0].includes('Microsoft')) {
        a.splice(0, 3)
    }

    a = a.map(i => {
        i = i
            .split('\t')[1]; // get the font name.
		if (!i) {
			return "";
		}
        if (i.indexOf("_") > -1 || i.indexOf("-") > -1) { // filer the illegal font.
            i = ''
        }

        i = i
            .replace(/^\s+|\s+$/g, '')
            .replace(/(Regular|常规|標準|보통)$/i, '')
            .replace(/^\s+|\s+$/g, '')

        if (i.includes(' ')) {
            i = `"${i}"`
        }

        return i
    })

    return a.filter(i => i)
}
const LANGUAGE_ENCODE = {
    en: "utf8",
    cn: "gb2312",
    jp: "shift-jis",
    ko: "euc-kr"
};
module.exports = (relativePath) => new Promise((resolve, reject) => {
    const fontManager = require('./font-manager/font-manager');
    fontManager.getAvailableFonts((fonts) => {
        if (!fonts) {
            reject(null);
        }
        var fontFamilies = fonts.map((f)=>{
            return f.family;
        });
        var resultMap = {};
        fontFamilies.forEach((f) => {
            resultMap[f] = true;
        });
        var uniqueFamilyNames = Object.keys(resultMap).sort();
        var resultFontObject = uniqueFamilyNames.map((uniqueFamilyName) => { // On windows, the electron and explorer canvas context can both paint CN font. 
            var uniqueFamilyNameAfterReplace = uniqueFamilyName.replace(/\"/g, '');
            return {
                fontLocalizedName: uniqueFamilyNameAfterReplace,
                fontOriginName: uniqueFamilyNameAfterReplace
            };
        });
        resolve(resultFontObject)
    });
})

// module.exports = (relativePath) => new Promise((resolve, reject) => {
//     let fn = path.join(__dirname, 'fonts.vbs')
//     //let c = fs.readFileSync(path.join('for_win', 'fonts.vbs'), 'utf-8')
//     //fs.writeFileSync(fn, c, 'utf-8')

//     //nichol add this code for electron https://github.com/electron/electron/issues/6262
//     exec("wmic os get locale", {encoding: "utf8"}, (err0, stdout0, stderr0) => { // get current system os culture
//         var language = "en";
//         if (stdout0) {
//             var code = parseInt(stdout0.toLowerCase().replace("locale", "").trim(), 16);
//             switch (code) {
//                 case 1041:
//                     language = "jp";
//                     break;
//                 case 1042:
//                     language = "ko";
//                     break;
//                 case 1028:
//                 case 2052:
//                     language = "cn";
//                     break;
//                 default:
//                     language = "en";
//                     break;
//             }
//         }
//         fn = fn.replace('app.asar', 'app.asar.unpacked');
//         let cmd = `cscript "${fn}"`
//         exec(cmd, {encoding: "buffer"}, (err, stdout, stderr) => { // fix bug SJS-10261: the font name is korean in KO OS.
//             stdout = iconv.decode(stdout, LANGUAGE_ENCODE[language]); // need this tool to decode the buffer.
//             let fonts = []
    
//             if (err) {
//                 reject(err)
//                 console.log(err);
//                 return
//             }
    
//             if (stdout) {
//                 //require('electron').dialog.showMessageBox({message: 'stdout: ' + stdout})
//                 fonts = fonts.concat(tryToGetFonts(stdout))
//             } else {
//                 //require('electron').dialog.showMessageBox({message: 'stderr: ' + stderr})
//                 fonts = fonts.concat(tryToGetFonts(stderr))
//             }
//             fonts.sort()
//             resolve(fonts)
//         })
//     });
// })
