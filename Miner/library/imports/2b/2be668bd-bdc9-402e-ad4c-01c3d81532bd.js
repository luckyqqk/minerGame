"use strict";
cc._RF.push(module, '2be66i9vclALq1MAcPYFTK9', 'Hook');
// Script/bean/Hook.js

'use strict';

var Constant = require('../constant/Constant');
var GameSocket = require('../pomelo/GameSocket');
cc.Class({
    extends: cc.Component,

    properties: {
        // 方向
        // 转速
        // 角度
        // itemId
        // status
        swingSpeed: 30,
        maxRotaLeft: 50,
        maxRotaRight: -50,
        speed: 600,
        partLeft: cc.Node,
        partRight: cc.Node,
        partMiddle: cc.Node,
        bolt: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // SWING       :   0,  // 摆动中
    // THROWING    :   1,  // 抛出中
    // BACKING     :   2,  // 拉回中

    onLoad: function onLoad() {
        this.direct = 0; // 摆动方向
        this.hookSpeedPer = 1; // 速度系数

        this.basePos = this.node.position;
        this.partLeftComp = this.partLeft.getComponent('HookPart');
        this.partRightComp = this.partRight.getComponent('HookPart');
        this.partMiddleComp = this.partMiddle.getComponent('HookMiddle');

        // cc.error(this.line);
    },
    onGameStart: function onGameStart() {
        this._repeatSwing();
    },
    onGameOver: function onGameOver() {
        this.node.stopAllActions();
    },
    setUid: function setUid(uid) {
        this.uid = uid;
    },
    sendThrowHook: function sendThrowHook() {
        if (this.status != Constant.HOOK_STATUS.SWING) return;
        var param = { type: Constant.OPERATOR.C2S_THROW_HOOK, intValue: [Math.floor(this.node.rotation), this.direct] };
        GameSocket.doOperator(param).catch(function (code) {
            cc.error(Constant.GAME_CODE[code]);
        });
    },
    throwOut: function throwOut(intArr) {
        var _this = this;

        if (this.status != Constant.HOOK_STATUS.SWING) return;
        this.status = Constant.HOOK_STATUS.THROWING;
        this.node.stopAllActions();

        this.partRightComp.doOpenAct(1);
        this.partLeftComp.doOpenAct().then(function () {
            var worldPos = _this.node.parent.convertToWorldSpaceAR(_this.node.position);
            var width = worldPos.x,
                height = worldPos.y,
                rota = intArr[0];
            _this.direct = intArr[1];
            _this.node.rotation = rota;
            var bottomX = height * Math.tan(rota * 0.017453293);
            bottomX = width - bottomX;
            var bottomPos = _this.node.parent.convertToNodeSpaceAR(cc.v2(bottomX, 0));
            // let dis = bottomPos.sub(this.node.convertToWorldSpaceAR(this.basePos)).mag();
            var parentPos = _this.node.parent.position;
            var maxDistance = Math.sqrt(parentPos.x * parentPos.x + parentPos.y * parentPos.y);
            var time = Math.floor(maxDistance / _this._getHookSpeed());
            _this.node.runAction(cc.moveTo(time, bottomPos));
        });
    },
    collision: function collision(other) {
        if (!this.uid) // 不是自己的爪子,不碰撞
            return;
        if (this.status < 2) return;

        if (other.node.group == 'aroundCli') {
            this.status = Constant.HOOK_STATUS.COLLISION; // 避免瞬间碰撞
            this.node.stopAllActions();
            GameSocket.doOperator({ type: Constant.OPERATOR.C2S_HOLD_ITEM, intValue: [] }).catch(function (code) {
                cc.error(Constant.GAME_CODE[code]);
            });
        } else if (other.node.group == 'mine') {
            // 拉回状态不碰矿
            if (this.status == Constant.HOOK_STATUS.BACKING) return;
            if (other.node.getComponent('Mine').status != Constant.MINE_STATUS.CAN_CLI) return;
            this.status = Constant.HOOK_STATUS.COLLISION; // 避免瞬间碰撞
            this.node.stopAllActions();
            var mineCamp = other.node.getComponent('Mine');
            var param = { type: Constant.OPERATOR.C2S_HOLD_ITEM, intValue: [mineCamp.id] };
            GameSocket.doOperator(param).catch(function (code) {
                cc.error(Constant.GAME_CODE[code]);
            });
        }
    },
    holdItem: function holdItem(mineCamp) {
        var _this2 = this;

        this.status = Constant.HOOK_STATUS.BACKING;
        this.node.stopAllActions();
        this.mineCamp = mineCamp;
        var rota = 0;
        if (!!mineCamp) {
            mineCamp.setHookMiddle(this.partMiddle);
            rota = mineCamp['rota'];
        }
        this.partRightComp.doCloseAct(-rota);
        this.partLeftComp.doCloseAct(rota).then(function () {
            _this2._pullBacking();
        });
    },
    _pullBacking: function _pullBacking() {
        var speed = !!this.mineCamp ? this.mineCamp['speed'] * this.hookSpeedPer : this._getHookSpeed();
        var dis = this.node.position.sub(this.basePos).mag();
        var time = dis / speed;
        var move = cc.moveTo(time, this.basePos);
        if (!this.uid) {
            this.node.runAction(move);
            return;
        }
        var callBackCB = cc.callFunc(function () {
            GameSocket.doOperator({ type: Constant.OPERATOR.C2S_GET_HOOK }).catch(function (code) {
                cc.error(Constant.GAME_CODE[code]);
            });
        }, this);
        this.node.runAction(cc.sequence(move, callBackCB));
    },
    getItemFromHook: function getItemFromHook(intValue) {
        var _this3 = this;

        this.partRightComp.doCloseAct(0);
        this.partLeftComp.doCloseAct(0).then(function () {
            _this3.status = Constant.HOOK_STATUS.SWING;
            var doRepeat = cc.callFunc(function () {
                this.direct = 1 - this.direct; // 转向
                this.node.stopAllActions();
                this._repeatSwing();
            }, _this3);
            var aimRota = !!_this3.direct ? _this3.maxRotaLeft : _this3.maxRotaRight;
            var swingTime = Math.abs(aimRota - _this3.node.rotation) / _this3.swingSpeed;
            _this3.node.runAction(cc.sequence(cc.rotateTo(swingTime, aimRota), doRepeat));
        });
        if (!intValue[0]) return null;
        var mineCamp = this.mineCamp;
        if (!mineCamp) return null;
        mineCamp.waitUse();
        this.mineCamp = null;
        this._resetHookSpeedPer();
        return mineCamp;
    },
    _repeatSwing: function _repeatSwing() {
        this.status = Constant.HOOK_STATUS.SWING;
        var changeDirect = cc.callFunc(function () {
            this.direct = 1 - this.direct; // 转向
        }, this);
        var swingTime = Math.abs(this.maxRotaLeft - this.maxRotaRight) / this.swingSpeed;
        var seqActInt = !!this.direct ? cc.sequence(cc.rotateTo(swingTime, this.maxRotaLeft), changeDirect, cc.rotateTo(swingTime, this.maxRotaRight)) : cc.sequence(cc.rotateTo(swingTime, this.maxRotaRight), changeDirect, cc.rotateTo(swingTime, this.maxRotaLeft));
        this.node.runAction(cc.repeatForever(seqActInt));
    },


    // start () {
    // },

    onBomb: function onBomb() {
        this.node.stopAllActions();
        // let rota = this.node.rotation;
        this.mineCamp.node.runAction(cc.sequence(cc.removeSelf(true), cc.callFunc(function () {
            var _this4 = this;

            this.mineCamp = null;
            this.partRightComp.doCloseAct(0);
            this.partLeftComp.doCloseAct(0).then(function () {
                _this4._pullBacking();
            });
        }, this)));
    },
    onMagnet: function onMagnet() {
        this.hookSpeedPer = 2;
        this.bolt.active = true;
        var theMineCamp = this.mineCamp;
        if (!theMineCamp) return;
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
    _resetHookSpeedPer: function _resetHookSpeedPer() {
        this.hookSpeedPer = 1;
        this.bolt.active = false;
    },
    _getHookSpeed: function _getHookSpeed() {
        return this.speed * this.hookSpeedPer;
    }
}

// update: function(dt) {
// if (!this.lineGraph)
//     return;
// this.lineGraph.clear();
// this.lineGraph.moveTo(this.node.position.x, this.node.position.y);
// this.lineGraph.lineTo(this.partMiddle.position.x, this.partMiddle.position.y);

// },
);

cc._RF.pop();