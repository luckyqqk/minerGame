(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/constant/Constant.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6f0d3iJnpRJd6JdBqWF7tC5', 'Constant', __filename);
// Script/constant/Constant.js

'use strict';

/**
 * Created by qingkai.wu on 2018/8/23.
 */
var Constant = module.exports;

Constant.SERVER = {
    HOST: "localhost",
    PORT: 3014,
    GAME_TYPE: 100002
};

Constant.PLATFORM = {
    GameKey: 'sdfwwsdfsaewfweasfgwer',
    GameSecret: 'wedfhsdregerwgregergee',
    TABLE_ID: 123,
    TABLE_KEY: '12312312'
};

Constant.HOOK_STATUS = {
    SWING: 0, // 摆动中
    COLLISION: 1, // 碰撞中
    THROWING: 2, // 抛出中
    BACKING: 3 // 拉回中
};

Constant.MINE_STATUS = {
    CAN_CLI: 0,
    MOVE_ING: 1,
    WAIT_USE: 2
};

Constant.TOOL_SIZE = 2; // 道具栏位个数

Constant.GAME_CODE = {
    1001: '不支持的游戏类型',
    1002: '桌子已开始',
    1003: '桌子已结束',
    10001: '无此玩家', // 无此玩家
    10002: '钩子状态不对', // 钩子状态不对
    10003: '无此道具', // 无此道具
    10004: '道具已满', // 道具已满
    10005: '不是道具', // 不是道具
    10006: '无此道具' // 无此道具
};

Constant.FIGHTER_RESULT = {
    WIN: 1, //1获胜
    LOSE: 2, //2失败
    DRAW: 3 //3平局
};

Constant.OPERATOR = {
    C2S_THROW_HOOK: 101,
    C2S_HOLD_ITEM: 102,
    C2S_GET_HOOK: 103,
    C2S_USE_TOOL: 104,

    S2C_THROW_HOOK: 201,
    S2C_HOLD_ITEM: 202,
    S2C_GET_HOOK: 203,
    S2C_USE_TOOL: 204
};

Constant.LOGIC_UPDATE_TIME = 0.033;

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
        //# sourceMappingURL=Constant.js.map
        