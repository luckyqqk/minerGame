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
        aimN    : cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {

    },

    update (dt) {
        let g = this.getComponent(cc.Graphics);
        g.clear();
        let fromPos = this.node.position;
        let aimPos = this.aimN.parent.convertToWorldSpaceAR(this.aimN.position);
        g.moveTo(0, 0);
        g.lineTo(aimPos.x - fromPos.x, aimPos.y - fromPos.y);
        g.close();
        g.stroke();
        g.fill();
    },
});
