"use strict";
cc._RF.push(module, '68dbaks8zxBsYiCbwczaAgH', 'Tool');
// Script/bean/Tool.js

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

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.toolCamp = null;
    },
    start: function start() {},
    addItemCamp: function addItemCamp(toolCamp) {
        if (!!this.toolCamp) return false;
        this.toolCamp = toolCamp;
        return true;
    },
    useItem: function useItem(aimPos) {
        var _this = this;

        return new Promise(function (resolve, reject) {
            var actCB = cc.callFunc(function () {
                resolve();
            }, _this);
            _this.toolCamp.node.runAction(cc.sequence(cc.moveTo(0.5, aimPos), cc.removeSelf(true), actCB));
            _this.toolCamp = null;
        });
    },
    checkToolClick: function checkToolClick(touchPos) {
        return !!this.toolCamp && this.node.getBoundingBoxToWorld().contains(touchPos);
    }
    // update (dt) {},

});

cc._RF.pop();