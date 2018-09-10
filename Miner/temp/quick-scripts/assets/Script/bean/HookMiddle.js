(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/bean/HookMiddle.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '499f0q2UsxJnoUMIIfnI2AL', 'HookMiddle', __filename);
// Script/bean/HookMiddle.js

'use strict';

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
        this.collisionManager = cc.director.getCollisionManager();
        this.collisionManager.enabled = true;
        // this.collisionManager.enabledDebugDraw = true;
        // this.collisionManager.enabledDrawBoundingBox = true;
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     */
    onCollisionEnter: function onCollisionEnter(other) {
        this.node.parent.getComponent('Hook').collision(other);
    }

    // start () {},
    // update (dt) {},
});

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
        //# sourceMappingURL=HookMiddle.js.map
        