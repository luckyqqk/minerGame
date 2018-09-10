(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/data/json2memory.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5c24a+hr1JMBroke0YIEFXg', 'json2memory', __filename);
// Script/data/json2memory.js

"use strict";

/**
 * Created by qingkai.wu on 2018/8/22.
 */
var Json2memory = function Json2memory() {
    this.jsonFile = {};
};

Json2memory.prototype.loadJson = function () {
    var _this = this;

    return new Promise(function (resolve, reject) {
        cc.loader.loadResDir("json", function (err, data) {
            if (!!err) {
                reject(err);
                return;
            }
            data.forEach(function (jsonAsset) {
                _this.jsonFile[jsonAsset.name] = jsonAsset.json;
            });
            resolve();
        });
    });
};

Json2memory.prototype.getData = function (fileName) {
    return this.jsonFile[fileName];
};

Json2memory.prototype.getDataById = function (fileName, id) {
    return this.jsonFile[fileName][id];
};

window.JsonData = new Json2memory();

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=json2memory.js.map
        