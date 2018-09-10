(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9506dflHn5BuK1fEnkbX74k', 'Game', __filename);
// Script/Game.js

'use strict';

var _cc$Class;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BasePanel = require('./BasePanel');
var Constant = require('./constant/Constant');
var GameSocket = require('./pomelo/GameSocket');

var Util = require('./Util');
cc.Class((_cc$Class = {
    extends: cc.Component
}, _defineProperty(_cc$Class, 'extends', BasePanel), _defineProperty(_cc$Class, 'statics', {}), _defineProperty(_cc$Class, 'properties', {
    canvasNode: cc.Node,
    gameTime: cc.Node,
    mineArea: cc.Node,
    userInfoRed: cc.Node,
    userInfoBlue: cc.Node,
    playerRed: cc.Node,
    playerBlue: cc.Node,
    notice: cc.Node,
    loading: cc.Node,
    audio: {
        default: [],
        type: cc.AudioClip
    }
}), _defineProperty(_cc$Class, 'onLoad', function onLoad() {
    var _this = this;

    this.noticeCamp = this.notice.getComponent('GameNotice');
    this.onTouchEvent(this.canvasNode);

    this.myUid = 0; // 本人id
    this.mines = {}; // 矿
    this.gamePlayers = {}; // 玩家游戏逻辑类

    var proArr = []; // 预处理的均放入该数组
    proArr.push(JsonData.loadJson());

    Promise.all(proArr).then(function () {
        GameSocket.addGameListener('onGameStart', _this.gameStart.bind(_this));
        GameSocket.addGameListener('onGameOver', _this.gameOver.bind(_this));
        GameSocket.addGameListener('onReborn', _this.mineReborn.bind(_this));
        GameSocket.addGameListener('onOperator', _this.doOperator.bind(_this));

        _this.guestLogin();
    }).catch(function (err) {
        cc.error('init err:' + err);
    });

    cc.audioEngine.play(this.audio[0], true, 1);
}), _defineProperty(_cc$Class, 'guestLogin', function guestLogin() {
    var _this2 = this;

    var uid = 'rand-' + Math.floor(200 + Math.random() * 1000);
    this.myUid = uid;

    var tableId = 'table-' + Math.floor(200 + Math.random() * 1000);
    var robotId = tableId;
    // let tableId = Constant.PLATFORM.TABLE_ID;
    // let robotId = null;
    GameSocket.loginGameServer(uid).then(function () {
        GameSocket.readyFight(Constant.PLATFORM.GameKey, tableId, Constant.PLATFORM.ROOM_KEY, robotId).catch(function (code) {
            _this2.noticeCamp.showNotice(Constant.GAME_CODE[code]);
        });
    }).catch(function (err) {
        cc.error(err);
    });
}), _defineProperty(_cc$Class, 'gameStart', function gameStart(data) {
    if (!!this.status) return;
    this.status = 1;

    var team = data['team'];

    for (var tempUid in team) {
        if (!team.hasOwnProperty(tempUid)) continue;
        this._setHead(tempUid, team[tempUid]);
    }

    this.gamePlayers[this.myUid].setUid(this.myUid);

    var mineInfo = data['mine'];
    for (var mineId in mineInfo) {
        if (!mineInfo.hasOwnProperty(mineId)) continue;
        this._setMine(mineInfo[mineId]);
    }

    this.gameTime.getComponent('TimeLabel').setTimeDown(data['timeDown'] || 60000);
    this.loading.active = false;
    cc.error('gameStart init over');
}), _defineProperty(_cc$Class, '_setHead', function _setHead(uid, sign) {
    var userInfoComp = null;
    if (sign == 1) {
        userInfoComp = this.userInfoRed.getComponent("UserInfo");
        this.gamePlayers[uid] = this.playerRed.getComponent('GamePlayer');
    } else {
        userInfoComp = this.userInfoBlue.getComponent("UserInfo");
        this.gamePlayers[uid] = this.playerBlue.getComponent('GamePlayer');
    }
    userInfoComp.setNickname(uid);
    this.gamePlayers[uid].onGameStart();
}), _defineProperty(_cc$Class, '_setMine', function _setMine(mineInfo) {
    var _this3 = this;

    var mineItemInfo = JsonData.getDataById('minerItem', mineInfo['itemId']);
    var dir = 'prefab/mine/';
    Util.createNodeByPrefab(dir + mineItemInfo['prefab'], function (err, newNode) {
        if (!!err) {
            cc.error(err);
            return;
        }
        var posInfo = JsonData.getDataById('nodePosition', mineInfo['pos']);
        newNode.setPosition(cc.v2(posInfo['pos'][0], posInfo['pos'][1]));
        var mineId = mineInfo.id;

        var mineComp = newNode.getComponent('Mine');
        mineComp.id = mineId;
        mineComp.itemId = mineInfo['itemId'];
        mineComp.score = Number.parseInt(mineItemInfo['score']);
        mineComp.skillId = mineItemInfo['skillId'];
        mineComp.speed = mineItemInfo['speed'];
        mineComp.rota = mineItemInfo['rota'];
        mineComp.type = mineItemInfo['type'];

        _this3.mines[mineId] = mineComp;
        _this3.mineArea.addChild(newNode);
    });
}), _defineProperty(_cc$Class, 'mineReborn', function mineReborn(data) {
    this._setMine(data);
}), _defineProperty(_cc$Class, 'onTouchEnd', function onTouchEnd(event) {
    if (this.status != 1) return;
    var playerCamp = this.gamePlayers[this.myUid];
    if (!playerCamp) {
        cc.error('not login');
        return;
    }

    var touchPos = this.node.convertToWorldSpace(event.getTouches()[0].getLocation());
    var clickIdx = playerCamp.checkToolClick(touchPos);
    if (clickIdx != -1) {
        GameSocket.doOperator({ type: Constant.OPERATOR.C2S_USE_TOOL, intValue: [clickIdx] });
    } else {
        playerCamp.sendThrowHook();
    }
}), _defineProperty(_cc$Class, 'doOperator', function doOperator(data) {
    var _this4 = this;

    var uid = data['uid'];
    var intValue = data['intValue'];
    var playerCamp = this.gamePlayers[uid];
    switch (data.type) {
        case Constant.OPERATOR.S2C_THROW_HOOK:
            playerCamp.throwHook(intValue);
            break;
        case Constant.OPERATOR.S2C_HOLD_ITEM:
            playerCamp.holdItem(this.mines[intValue[0]]);
            break;
        case Constant.OPERATOR.S2C_GET_HOOK:
            playerCamp.getItemFromHook(intValue);
            break;
        case Constant.OPERATOR.S2C_USE_TOOL:
            var effectUser = this.gamePlayers[intValue[2]];
            playerCamp.useTool(intValue[0], effectUser.node.parent.convertToWorldSpaceAR(effectUser.node.position)).then(function () {
                switch (intValue[1]) {
                    case 1:
                        effectUser.onBomb(intValue[3]);
                        cc.audioEngine.play(_this4.audio[1], false, 1);
                        break;
                    case 2:
                        effectUser.onMagnet();
                        cc.audioEngine.play(_this4.audio[2], false, 1);
                        break;
                }
            });
            break;
    }
}), _defineProperty(_cc$Class, 'gameOver', function gameOver(data) {
    this.noticeCamp.showNotice(data[this.myUid] == Constant.FIGHTER_RESULT.WIN ? "游戏胜利" : "游戏失败");
    for (var tempUid in this.gamePlayers) {
        if (!this.gamePlayers.hasOwnProperty(tempUid)) continue;
        this.gamePlayers[tempUid].onGameOver();
    }
    cc.audioEngine.stopAll();
    cc.error('gameOver');
}), _cc$Class));

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
        //# sourceMappingURL=Game.js.map
        