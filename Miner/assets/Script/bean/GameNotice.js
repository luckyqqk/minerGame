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
    },

    showNotice(note) {
        this.node.getComponent(cc.Label).string = note;
        this.node.active = true;
        this.node.runAction(cc.sequence(cc.fadeOut(5), cc.callFunc(function(){
            this.node.active = false;
        }, this)));
    }

    // onLoad () {},
    // start () {},
    // update (dt) {},
});
