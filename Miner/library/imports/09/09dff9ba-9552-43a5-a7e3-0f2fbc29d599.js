"use strict";
cc._RF.push(module, '09dffm6lVJDpafjDy+8KdWZ', 'Mine');
// Script/bean/Mine.js

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
var Constant = require('../constant/Constant');
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this.status = Constant.MINE_STATUS.CAN_CLI;
        // this.collisionManager = cc.director.getCollisionManager();
        // this.collisionManager.enabled = true;
        // this.collisionManager.enabledDebugDraw = true;
        // this.collisionManager.enabledDrawBoundingBox = true;
    },


    // start () {},

    // onCollisionEnter: function(other) {
    //     if (this.status != Constant.MINE_STATUS.CAN_CLI)
    //         return;
    //     let hook = other.node.parent.getComponent('Hook');
    //     if (hook.status != Constant.HOOK_STATUS.THROWING)
    //         return;
    //     this.status = Constant.MINE_STATUS.MOVE_ING;
    //     this.hook = other.node;
    // },

    setHookMiddle: function setHookMiddle(hookMiddle) {
        this.status = Constant.MINE_STATUS.MOVE_ING;
        this.hookMiddle = hookMiddle;
    },
    waitUse: function waitUse() {
        this.status = Constant.MINE_STATUS.WAIT_USE;
        this.hookMiddle = null;
    },
    update: function update(dt) {
        if (this.status != Constant.MINE_STATUS.MOVE_ING) return;
        this.node.position = this.hookMiddle.convertToWorldSpaceAR(this.hookMiddle.position);
    }
});

cc._RF.pop();