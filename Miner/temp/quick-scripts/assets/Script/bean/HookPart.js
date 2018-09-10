(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/bean/HookPart.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b871acRhPZGq6rISZv288K4', 'HookPart', __filename);
// Script/bean/HookPart.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this.status = 0;

        this.openAct1 = cc.rotateTo(0.5, -33);
        this.openAct2 = cc.rotateTo(0.5, 33);
    },


    // doAction(sign) {
    //     return new Promise((resolve, reject)=> {
    //         let actCB = cc.callFunc(function () {
    //             resolve();
    //         }, this);
    //         if (!!sign)
    //             this.node.runAction(this.openAct2);
    //         else
    //             this.node.runAction(this.openAct1);
    //
    //         this.status = 1 - this.status;
    //     });
    // },

    doOpenAct: function doOpenAct(sign) {
        var _this = this;

        return new Promise(function (resolve, reject) {
            var actCB = cc.callFunc(function () {
                resolve();
            }, _this);
            if (!!sign) _this.node.runAction(cc.sequence(_this.openAct1, actCB));else _this.node.runAction(cc.sequence(_this.openAct2, actCB));
        });
    },
    doCloseAct: function doCloseAct(rota) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
            if (_this2.node.rotation == rota) {
                resolve();
                return;
            }
            var actCB = cc.callFunc(function () {
                resolve();
            }, _this2);
            _this2.node.runAction(cc.sequence(cc.rotateTo(0.5, rota), actCB));
        });
    },
    start: function start() {}
}

// update (dt) {},
);

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
        //# sourceMappingURL=HookPart.js.map
        