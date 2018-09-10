"use strict";
cc._RF.push(module, '911eaKBX3dEWquBU2r3bM22', 'Util');
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