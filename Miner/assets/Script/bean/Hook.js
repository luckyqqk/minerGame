
const Constant = require('../constant/Constant');
const GameSocket = require('../pomelo/GameSocket');
cc.Class({
    extends: cc.Component,

    properties: {
        // 方向
        // 转速
        // 角度
        // itemId
        // status
        swingSpeed  : 30,
        maxRotaLeft : 50,
        maxRotaRight: -50,
        speed       : 600,
        partLeft    : cc.Node,
        partRight   : cc.Node,
        partMiddle  : cc.Node,
        bolt        : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // SWING       :   0,  // 摆动中
    // THROWING    :   1,  // 抛出中
    // BACKING     :   2,  // 拉回中

    onLoad () {
        this.direct = 0;    // 摆动方向
        this.hookSpeedPer = 1;  // 速度系数

        this.basePos = this.node.position;
        this.partLeftComp = this.partLeft.getComponent('HookPart');
        this.partRightComp = this.partRight.getComponent('HookPart');
        this.partMiddleComp = this.partMiddle.getComponent('HookMiddle');

        // cc.error(this.line);

    },

    onGameStart() {
        this._repeatSwing();
    },

    onGameOver() {
        this.node.stopAllActions();
    },

    setUid(uid) {
        this.uid = uid;
    },

    sendThrowHook() {
        if (this.status != Constant.HOOK_STATUS.SWING)
            return;
        let param = {type:Constant.OPERATOR.C2S_THROW_HOOK, intValue:[Math.floor(this.node.rotation), this.direct]};
        GameSocket.doOperator(param).catch(code=>{
            cc.error(Constant.GAME_CODE[code]);
        });
    },

    throwOut(intArr) {
        if (this.status != Constant.HOOK_STATUS.SWING)
            return;
        this.status = Constant.HOOK_STATUS.THROWING;
        this.node.stopAllActions();

        this.partRightComp.doOpenAct(1);
        this.partLeftComp.doOpenAct().then(()=>{
            let worldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
            let width = worldPos.x,
                height = worldPos.y,
                rota = intArr[0];
            this.direct = intArr[1];
            this.node.rotation = rota;
            let bottomX = height * Math.tan(rota * 0.017453293);
            bottomX = width - bottomX;
            let bottomPos = this.node.parent.convertToNodeSpaceAR(cc.v2(bottomX, 0));
            // let dis = bottomPos.sub(this.node.convertToWorldSpaceAR(this.basePos)).mag();
            let parentPos = this.node.parent.position;
            let maxDistance = Math.sqrt(parentPos.x * parentPos.x + parentPos.y * parentPos.y);
            let time = Math.floor(maxDistance / this._getHookSpeed());
            this.node.runAction(cc.moveTo(time, bottomPos));
        });
    },

    collision(other) {
        if (!this.uid)  // 不是自己的爪子,不碰撞
            return;
        if (this.status < 2)
            return;

        if (other.node.group == 'aroundCli') {
            this.status = Constant.HOOK_STATUS.COLLISION;   // 避免瞬间碰撞
            this.node.stopAllActions();
            GameSocket.doOperator({type:Constant.OPERATOR.C2S_HOLD_ITEM, intValue:[]}).catch(code=>{
                cc.error(Constant.GAME_CODE[code]);
            });
        } else if (other.node.group == 'mine') {
            // 拉回状态不碰矿
            if (this.status == Constant.HOOK_STATUS.BACKING)
                return;
            if (other.node.getComponent('Mine').status != Constant.MINE_STATUS.CAN_CLI)
                return;
            this.status = Constant.HOOK_STATUS.COLLISION;   // 避免瞬间碰撞
            this.node.stopAllActions();
            let mineCamp = other.node.getComponent('Mine');
            let param = {type:Constant.OPERATOR.C2S_HOLD_ITEM, intValue:[mineCamp.id]};
            GameSocket.doOperator(param).catch(code=>{
                cc.error(Constant.GAME_CODE[code]);
            });
        }
    },

    holdItem(mineCamp) {
        this.status = Constant.HOOK_STATUS.BACKING;
        this.node.stopAllActions();
        this.mineCamp = mineCamp;
        let rota = 0;
        if (!!mineCamp) {
            mineCamp.setHookMiddle(this.partMiddle);
            rota = mineCamp['rota'];
        }
        this.partRightComp.doCloseAct(-rota);
        this.partLeftComp.doCloseAct(rota).then(()=>{
            this._pullBacking();
        });
    },

    _pullBacking() {
        let speed = !!this.mineCamp ? this.mineCamp['speed'] * this.hookSpeedPer : this._getHookSpeed();
        let dis = this.node.position.sub(this.basePos).mag();
        let time = dis / speed;
        let move = cc.moveTo(time, this.basePos);
        if (!this.uid) {
            this.node.runAction(move);
            return;
        }
        let callBackCB = cc.callFunc(function() {
            GameSocket.doOperator({type:Constant.OPERATOR.C2S_GET_HOOK}).catch(code=>{
                cc.error(Constant.GAME_CODE[code]);
            });
        }, this);
        this.node.runAction(cc.sequence(move, callBackCB));
    },

    getItemFromHook(intValue) {
        this.partRightComp.doCloseAct(0);
        this.partLeftComp.doCloseAct(0).then(()=>{
            this.status = Constant.HOOK_STATUS.SWING;
            let doRepeat = cc.callFunc(function() {
                this.direct = 1 - this.direct;  // 转向
                this.node.stopAllActions();
                this._repeatSwing();
            }, this);
            let aimRota = !!this.direct ? this.maxRotaLeft : this.maxRotaRight;
            let swingTime = Math.abs(aimRota - this.node.rotation) / this.swingSpeed;
            this.node.runAction(cc.sequence(cc.rotateTo(swingTime, aimRota), doRepeat));
        });
        if (!intValue[0])
            return null;
        let mineCamp = this.mineCamp;
        if (!mineCamp)
            return null;
        mineCamp.waitUse();
        this.mineCamp = null;
        this._resetHookSpeedPer();
        return mineCamp;
    },

    _repeatSwing() {
        this.status = Constant.HOOK_STATUS.SWING;
        let changeDirect = cc.callFunc(function() {
            this.direct = 1 - this.direct;  // 转向
        }, this);
        let swingTime = Math.abs(this.maxRotaLeft - this.maxRotaRight) / this.swingSpeed;
        let seqActInt = !!this.direct ?
            cc.sequence(cc.rotateTo(swingTime, this.maxRotaLeft), changeDirect, cc.rotateTo(swingTime, this.maxRotaRight)):
            cc.sequence(cc.rotateTo(swingTime, this.maxRotaRight), changeDirect, cc.rotateTo(swingTime, this.maxRotaLeft));
        this.node.runAction(cc.repeatForever(seqActInt));
    },

    // start () {
    // },

    onBomb() {
        this.node.stopAllActions();
        // let rota = this.node.rotation;
        this.mineCamp.node.runAction(cc.sequence(cc.removeSelf(true), cc.callFunc(function(){
            this.mineCamp = null;
            this.partRightComp.doCloseAct(0);
            this.partLeftComp.doCloseAct(0).then(()=>{
                this._pullBacking();
            });
        }, this)));
    },

    onMagnet() {
        this.hookSpeedPer = 2;
        this.bolt.active = true;
        let theMineCamp = this.mineCamp;
        if (!theMineCamp)
            return;
        this.node.stopAllActions();
        this._pullBacking();
        // let rota = this.node.rotation;
        // this.partRightComp.doCloseAct(-rota);
        // this.partLeftComp.doCloseAct(rota).then(()=>{
        // });
    },

    // effectSkill(skillType, isEffect) {
    //     switch (skillType) {
    //         case 1:
    //             if (!isEffect)
    //                 break;
    //             this.node.stopAllActions();
    //             this.mineCamp.node.runAction(cc.sequence(cc.removeSelf(true), cc.callFunc(function(){
    //                 this.mineCamp = null;
    //                 this.partRightComp.doCloseAct(-rota);
    //                 this.partLeftComp.doCloseAct(rota).then(()=>{
    //                     this._pullBacking();
    //                 });
    //             }, this)));
    //             break;
    //         case 2:
    //             this.hookSpeedPer = 2;
    //             this.bolt.active = true;
    //             let theMineCamp = this.mineCamp;
    //             if (!theMineCamp)
    //                 break;
    //             this.node.stopAllActions();
    //             let rota = this.node.rotation;
    //             this.partRightComp.doCloseAct(-rota);
    //             this.partLeftComp.doCloseAct(rota).then(()=>{
    //                 this._pullBacking();
    //             });
    //             break;
    //     }
    // },

    // 抓到一个道具后,加速失效
    _resetHookSpeedPer() {
        this.hookSpeedPer = 1;
        this.bolt.active = false;
    },

    _getHookSpeed() {
        return this.speed * this.hookSpeedPer;
    },

    // update: function(dt) {
        // if (!this.lineGraph)
        //     return;
        // this.lineGraph.clear();
        // this.lineGraph.moveTo(this.node.position.x, this.node.position.y);
        // this.lineGraph.lineTo(this.partMiddle.position.x, this.partMiddle.position.y);

    // },
});
