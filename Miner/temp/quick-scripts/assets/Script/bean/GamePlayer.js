(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/bean/GamePlayer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9444aeAMClNMJIiqZcY4Nhm', 'GamePlayer', __filename);
// Script/bean/GamePlayer.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        score: cc.Label,
        hook: cc.Node,
        toolLeft: cc.Node,
        toolRight: cc.Node,
        role: cc.Node,
        roleBomb: cc.Node
    },

    onLoad: function onLoad() {
        this.scoreNum = 0;
        this.hookHomeplace = this.hook.position;
        this.scoreComp = this.score.getComponent(cc.Label);
        this.hookComp = this.hook.getComponent("Hook");
        this.toolLeft = this.toolLeft.getComponent("Tool");
        this.toolRight = this.toolRight.getComponent("Tool");
        // this.roleBomb = this.roleBomb.getComponent("Tool");
    },
    start: function start() {},
    onGameStart: function onGameStart() {
        this.hookComp.onGameStart();
    },
    onGameOver: function onGameOver() {
        this.hookComp.onGameOver();
    },

    // update (dt) {},

    setUid: function setUid(uid) {
        this.uid = uid;
        this.hookComp.setUid(uid);
    },
    sendThrowHook: function sendThrowHook() {
        this.hookComp.sendThrowHook();
    },
    throwHook: function throwHook(intArr) {
        this.hookComp.throwOut(intArr);
    },
    holdItem: function holdItem(mineCamp) {
        this.hookComp.holdItem(mineCamp);
    },
    getItemFromHook: function getItemFromHook(intValue) {
        var theMineCamp = this.hookComp.getItemFromHook(intValue);
        if (!theMineCamp) return;
        switch (theMineCamp['type']) {
            case 0:
                var actOver = cc.callFunc(function () {
                    this.scoreNum += theMineCamp['score'];
                    this.scoreComp.string = this.scoreNum;
                }, this);

                var aimPos = this.scoreComp.node.parent.convertToWorldSpaceAR(this.scoreComp.node.position);
                var spa = cc.spawn(cc.moveTo(1, aimPos), cc.fadeOut(1));
                theMineCamp.node.runAction(cc.sequence(spa, cc.removeSelf(true), actOver));
                break;
            case 1:
                var actOver2 = cc.callFunc(function () {
                    this.scoreNum += theMineCamp['score'];
                    this.scoreComp.string = this.scoreNum;
                }, this);

                var toolCamp = null;
                if (this.toolLeft.addItemCamp(theMineCamp)) {
                    toolCamp = this.toolLeft;
                } else if (this.toolRight.addItemCamp(theMineCamp)) {
                    toolCamp = this.toolRight;
                } else {
                    theMineCamp.node.runAction(cc.sequence(cc.removeSelf(true), actOver2));
                    return;
                }
                theMineCamp.node.setScale(cc.v2(0.6, 0.6));
                var aimPos2 = this.node.convertToWorldSpaceAR(toolCamp.node.position);
                theMineCamp.node.runAction(cc.sequence(cc.moveTo(1, aimPos2), actOver2));
                break;
        }
    },
    checkToolClick: function checkToolClick(touchPos) {
        var clickToolIdx = -1;
        if (this.toolLeft.checkToolClick(touchPos)) clickToolIdx = 0;else if (this.toolRight.checkToolClick(touchPos)) clickToolIdx = 1;
        return clickToolIdx;
    },
    useTool: function useTool(toolIdx, aimPos) {
        var _this = this;

        return new Promise(function (resolve, reject) {
            var toolForJump = !toolIdx ? _this.toolLeft : _this.toolRight;
            toolForJump.useItem(aimPos).then(resolve).catch(reject);
        });
    },
    onBomb: function onBomb(effect) {
        this._showRoleBomb();
        if (!!effect) this.hookComp.onBomb();
    },
    onMagnet: function onMagnet() {
        this.hookComp.onMagnet();
    },


    // effectSkill(skillType, isEffect) {
    //     this.hookComp.effectSkill(skillType, isEffect);
    //     switch (skillType) {
    //         case 1:
    //             this._showRoleBomb();
    //             break;
    //         case 2:
    //             break;
    //     }
    // },

    _showRoleBomb: function _showRoleBomb() {
        this.roleBomb.active = true;
        this.role.active = false;
        setTimeout(this._hideRoleBomb.bind(this), 2000);
    },
    _hideRoleBomb: function _hideRoleBomb() {
        this.role.active = true;
        this.roleBomb.active = false;
    }
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
        //# sourceMappingURL=GamePlayer.js.map
        