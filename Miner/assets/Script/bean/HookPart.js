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

    onLoad () {
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

    doOpenAct(sign) {
        return new Promise((resolve, reject)=>{
            let actCB = cc.callFunc(function(){
                resolve();
            }, this);
            if (!!sign)
                this.node.runAction(cc.sequence(this.openAct1, actCB));
            else
                this.node.runAction(cc.sequence(this.openAct2, actCB));
        });
    },

    doCloseAct(rota) {
        return new Promise((resolve, reject)=>{
            if (this.node.rotation == rota) {
                resolve();
                return;
            }
            let actCB = cc.callFunc(function(){
                resolve();
            }, this);
            this.node.runAction(cc.sequence(cc.rotateTo(0.5, rota), actCB));
        });
    },

    start () {

    },

    // update (dt) {},
});
