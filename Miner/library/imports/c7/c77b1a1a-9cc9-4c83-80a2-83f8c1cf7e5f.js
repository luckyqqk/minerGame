"use strict";
cc._RF.push(module, 'c77b1oanMlMg4Cig/jBz35f', 'TimeLabel');
// Script/bean/TimeLabel.js

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
        timeLabel: cc.Label
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

    setTimeDown: function setTimeDown(timemillis) {
        this.timeSecond = Math.floor(timemillis / 1000);
        this.timeSecond--;
        this.timeLabel.string = this.timeSecond;
        cc.director.getScheduler().schedule(this, this.updates, 1, cc.macro.REPEAT_FOREVER, 0, false);
    },
    updates: function updates() {
        if (this.timeSecond-- == 0) {
            this.unschedule(this.updates);
        } else {
            this.timeLabel.string = this.timeSecond;
        }
    }
}

// LIFE-CYCLE CALLBACKS:

// onLoad () {},

// start () {},

// update (dt) {},
);

cc._RF.pop();