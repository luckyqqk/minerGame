(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Util.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '911eaKBX3dEWquBU2r3bM22', 'Util', __filename);
// Script/Util.js

"use strict";

/**
 * Created by qingkai.wu on 2018/8/24.
 */

var Util = module.exports;

Util.createNodeByPrefab = function (prefabAdr, cb) {
    cc.loader.loadRes(prefabAdr, function (err, data) {
        if (!!err) cb(err);else if (!data instanceof cc.Prefab) cb(prefabAdr + " is not prefab file");else cb(null, cc.instantiate(data));
    });
};

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
        //# sourceMappingURL=Util.js.map
        