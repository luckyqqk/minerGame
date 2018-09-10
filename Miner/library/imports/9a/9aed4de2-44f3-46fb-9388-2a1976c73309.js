"use strict";
cc._RF.push(module, '9aed43iRPNG+5OIKhl2xzMJ', 'Line');
// Script/bean/Line.js

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
        aimN: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},
    start: function start() {},
    update: function update(dt) {
        var g = this.getComponent(cc.Graphics);
        g.clear();
        var fromPos = this.node.position;
        var aimPos = this.aimN.parent.convertToWorldSpaceAR(this.aimN.position);
        g.moveTo(0, 0);
        g.lineTo(aimPos.x - fromPos.x, aimPos.y - fromPos.y);
        g.close();
        g.stroke();
        g.fill();
    }
});

cc._RF.pop();