'use strict'
module.exports = () => new Promise((resolve, reject) => {
    const fontManager = require('./font-manager/font-manager');
    fontManager.getAvailableFonts((fonts) => {
        if (!fonts) {
            reject(null);
        }
        var fontFamilies = fonts.map((f) => {
            return f.family;
        });
        var resultMap = {};
        fontFamilies.forEach((f) => {
            resultMap[f] = true;
        });
        var uniqueFamilyNames = Object.keys(resultMap).sort();
        var resultFontObject = uniqueFamilyNames.map((uniqueFamilyName) => {
            var uniqueFamilyNameAfterReplace = uniqueFamilyName.replace(/\"/g, '');
            return {
                fontLocalizedName: uniqueFamilyNameAfterReplace,
                fontOriginName: uniqueFamilyNameAfterReplace
            };
        });
        resolve(resultFontObject)
    });
})
