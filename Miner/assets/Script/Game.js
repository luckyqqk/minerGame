const BasePanel = require('./BasePanel');
const Constant = require('./constant/Constant');
const GameSocket = require('./pomelo/GameSocket');

const Util = require('./Util');
cc.Class({
    extends: cc.Component,
    extends: BasePanel,

    statics: {

    },
    properties: {
        canvasNode  : cc.Node,
        gameTime    : cc.Node,
        mineArea    : cc.Node,
        userInfoRed : cc.Node,
        userInfoBlue: cc.Node,
        playerRed   : cc.Node,
        playerBlue  : cc.Node,
        notice      : cc.Node,
        loading     : cc.Node,
        audio       : {
            default : [],
            type    : cc.AudioClip
        },
    },

    onLoad () {
        this.noticeCamp = this.notice.getComponent('GameNotice');
        this.onTouchEvent(this.canvasNode);

        this.myUid = 0;         // 本人id
        this.mines = {};        // 矿
        this.gamePlayers = {};  // 玩家游戏逻辑类

        let proArr = [];    // 预处理的均放入该数组
        proArr.push(JsonData.loadJson());


        Promise.all(proArr).then(()=>{
            GameSocket.addGameListener('onGameStart', this.gameStart.bind(this));
            GameSocket.addGameListener('onGameOver', this.gameOver.bind(this));
            GameSocket.addGameListener('onReborn', this.mineReborn.bind(this));
            GameSocket.addGameListener('onOperator', this.doOperator.bind(this));

            this.guestLogin();
        }).catch(err=>{
            cc.error('init err:' + err);
        });

        cc.audioEngine.play(this.audio[0], true, 1);
    },
    // update (dt) {},
    // start () {},

    guestLogin() {
        let uid = 'rand-' + Math.floor(200 + Math.random() * 1000);
        this.myUid = uid;

        let tableId = 'table-' + Math.floor(200 + Math.random() * 1000);
        let robotId = tableId;
        // let tableId = Constant.PLATFORM.TABLE_ID;
        // let robotId = null;
        GameSocket.loginGameServer(uid).then(()=>{
            GameSocket.readyFight(Constant.PLATFORM.GameKey, tableId, Constant.PLATFORM.ROOM_KEY, robotId).catch(code=>{
                this.noticeCamp.showNotice(Constant.GAME_CODE[code]);
            });
        }).catch(err=>{cc.error(err)});
    },

    gameStart(data) {
        if (!!this.status)
            return;
        this.status = 1;

        let team = data['team'];

        for (let tempUid in team) {
            if (!team.hasOwnProperty(tempUid))
                continue;
            this._setHead(tempUid, team[tempUid]);
        }

        this.gamePlayers[this.myUid].setUid(this.myUid);

        let mineInfo = data['mine'];
        for (let mineId in mineInfo) {
            if (!mineInfo.hasOwnProperty(mineId))
                continue;
            this._setMine(mineInfo[mineId]);
        }

        this.gameTime.getComponent('TimeLabel').setTimeDown(data['timeDown'] || 60000);
        this.loading.active = false;
        cc.error('gameStart init over');
    },

    _setHead(uid, sign) {
        let userInfoComp = null;
        if (sign == 1) {
            userInfoComp = this.userInfoRed.getComponent("UserInfo");
            this.gamePlayers[uid] = this.playerRed.getComponent('GamePlayer');
        } else {
            userInfoComp = this.userInfoBlue.getComponent("UserInfo");
            this.gamePlayers[uid] = this.playerBlue.getComponent('GamePlayer');
        }
        userInfoComp.setNickname(uid);
        this.gamePlayers[uid].onGameStart();
    },

    _setMine(mineInfo) {
        let mineItemInfo = JsonData.getDataById('minerItem', mineInfo['itemId']);
        let dir = 'prefab/mine/';
        Util.createNodeByPrefab(dir + mineItemInfo['prefab'], (err, newNode)=>{
            if (!!err) {
                cc.error(err);
                return;
            }
            let posInfo = JsonData.getDataById(`nodePosition`, mineInfo['pos']);
            newNode.setPosition(cc.v2(posInfo['pos'][0], posInfo['pos'][1]));
            let mineId = mineInfo.id;

            let mineComp = newNode.getComponent('Mine');
            mineComp.id = mineId;
            mineComp.itemId = mineInfo['itemId'];
            mineComp.score = Number.parseInt(mineItemInfo['score']);
            mineComp.skillId = mineItemInfo['skillId'];
            mineComp.speed = mineItemInfo['speed'];
            mineComp.rota = mineItemInfo['rota'];
            mineComp.type = mineItemInfo['type'];

            this.mines[mineId] = mineComp;
            this.mineArea.addChild(newNode);
        })
    },

    mineReborn(data) {
        this._setMine(data);
    },

    onTouchEnd: function (event) {
        if (this.status != 1)
            return;
        let playerCamp = this.gamePlayers[this.myUid];
        if (!playerCamp) {
            cc.error('not login');
            return;
        }

        let touchPos = this.node.convertToWorldSpace(event.getTouches()[0].getLocation());
        let clickIdx = playerCamp.checkToolClick(touchPos);
        if (clickIdx != -1) {
            GameSocket.doOperator({type:Constant.OPERATOR.C2S_USE_TOOL, intValue:[clickIdx]});
        } else {
            playerCamp.sendThrowHook();
        }
    },

    doOperator(data) {
        let uid = data['uid'];
        let intValue = data['intValue'];
        let playerCamp = this.gamePlayers[uid];
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
                let effectUser = this.gamePlayers[intValue[2]];
                playerCamp.useTool(intValue[0], effectUser.node.parent.convertToWorldSpaceAR(effectUser.node.position)).then(()=>{
                    switch (intValue[1]) {
                        case 1:
                            effectUser.onBomb(intValue[3]);
                            cc.audioEngine.play(this.audio[1], false, 1);
                            break;
                        case 2:
                            effectUser.onMagnet();
                            cc.audioEngine.play(this.audio[2], false, 1);
                            break;
                    }
                });
                break;
        }
    },

    gameOver(data) {
        this.noticeCamp.showNotice(data[this.myUid] == Constant.FIGHTER_RESULT.WIN ? "游戏胜利" : "游戏失败");
        for (let tempUid in this.gamePlayers) {
            if (!this.gamePlayers.hasOwnProperty(tempUid))
                continue;
            this.gamePlayers[tempUid].onGameOver();
        }
        cc.audioEngine.stopAll();
        cc.error('gameOver');
    },
});