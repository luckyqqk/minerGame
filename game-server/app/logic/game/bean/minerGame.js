/**
 * Created by qingkai.wu on 2018/8/20.
 */
const staticData = require('json2memory');
const STATUS = require('../../../code/status');

// 钩子类
class Hook {
    constructor(hookId) {
        // this.hookId = hookId;            // 钩子皮肤, 字段预留
        this.status = Hook.HOOK_STATUS.SWING;    //
        this.itemId = null;                 // 钩子上的东西
    }

    throwOut() {
        if (this.status != Hook.HOOK_STATUS.SWING) {
            console.error(`throwOut:${this.status}`);
            return Game.GAME_CODE.HOOK_OUT_STATUS;
        }
        this.status = Hook.HOOK_STATUS.THROWING;
        return 0;
    }

    pullBack() {
        if (this.status != Hook.HOOK_STATUS.THROWING) {
            console.error(`pullBack:${this.status}`);
            return Game.GAME_CODE.HOOK_OUT_STATUS;
        }
        this.status = Hook.HOOK_STATUS.BACKING;
        return 0;
    }

    setItem(itemId) {
        this.itemId = itemId;
    }

    reset() {
        this.status = Hook.HOOK_STATUS.SWING;
        this.itemId = null;
    }
}
Hook.HOOK_STATUS = {
    SWING       :   0,  // 摆动中
    THROWING    :   1,  // 抛出中
    BACKING     :   2,  // 拉回中
};

class PlayerGameData {
    constructor() {
        this.score = 0;
        this.hook = null;
        // 道具栏
        this.toolList = [];
    }

    init(hookId) {
        this.hook = new Hook(hookId);
    }

    addSkill(skillId) {
        let idx = !this.toolList[0] ? 0 : -1;
        if (idx == -1)
            idx = !this.toolList[1] ? 1 : -1;
        if (idx == -1)
            return Game.GAME_CODE.FULL_TOOL;
        this.toolList[idx] = skillId;
        return 0;
    }

    /**
     * 根据下标获得道具
     * @param idx
     * @returns {Array} [0] err, [1] data
     */
    popToolByIdx(idx) {
        let toolId = this.toolList[idx];
        this.toolList[idx] = undefined;
        return toolId;
    }
}

PlayerGameData.TOOL_SIZE = 2;   // 道具栏位个数

const minerNode = staticData.getData('minerNode');
const minerItem = staticData.getData('minerItem');
const nodePosition = staticData.getData('nodePosition');
function _randItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}
class Mine {
    constructor(mineId) {
        this.reborn(mineId);
    }

    empty() {
        this.pos = null;
        this.itemId = null;
        // this.rebornTime
    }

    reborn(mineId) {
        let mineInfo = minerNode[mineId];
        if (!mineInfo)
            return;
        this.id = mineId;
        this.pos = _randItem(mineInfo['posRange']);
        this.itemId = _randItem(mineInfo['itemRange']);
        this.rebornTime = mineInfo['rebornTime'];
    }

    toClient() {
        return {id:this.id, pos:this.pos, itemId:this.itemId};
    }
}
// const minerItemKeys = Object.keys(staticData.getData('minerItem'));
class Game {
    constructor(event) {
        this.event = event;
        this.status = Game.GAME_STATUS.INIT;
        // 矿区(二维数组)
        this.mines = {};
        this.players = {};
    }

    init(uidArr) {
        this.status = Game.GAME_STATUS.INIT;

        for (let nodeKey in minerNode) {
            if (!minerNode.hasOwnProperty(nodeKey))
                continue;
            this.mines[nodeKey] = new Mine(nodeKey);
        }
        uidArr.forEach(uid=>{
            this._addPlayer(uid);
        });
    }

    getMines() {
        let res = {};
        for (let key in this.mines) {
            if (!this.mines.hasOwnProperty(key))
                continue;
            res[key] = this.mines[key].toClient();
        }
        return res;
    }

    start() {
        this.status = Game.GAME_STATUS.START;
    }

    stop() {
        this.status = Game.GAME_STATUS.STOP;
        let uidArr = Object.keys(this.players);
        let res = {};
        let uid0 = uidArr[0];
        let uid1 = uidArr[1];
        let diff = this.players[uid0].score - this.players[uid1].score;
        if (diff > 0) {
            res[uid0] = STATUS.FIGHTER_RESULT.WIN;
            res[uid1] = STATUS.FIGHTER_RESULT.LOSE;
        } else if (diff < 0) {
            res[uid1] = STATUS.FIGHTER_RESULT.WIN;
            res[uid0] = STATUS.FIGHTER_RESULT.LOSE;
        } else {
            res[uid1] = STATUS.FIGHTER_RESULT.DRAW;
            res[uid0] = STATUS.FIGHTER_RESULT.DRAW;
        }
        return res;
    }

    _addPlayer(uid) {
        let playerGameData = new PlayerGameData();
        playerGameData.init();
        this.players[uid] = playerGameData;
    }

    throwHook(uid) {
        let pgd = this.players[uid];
        if (!pgd)
            return Game.GAME_CODE.NO_THIS_PLAYER;
        else
            return pgd.hook.throwOut();
    }

    holdItem(uid, mineKey) {
        let pgd = this.players[uid];
        if (!pgd)
            return Game.GAME_CODE.NO_THIS_PLAYER;

        let pullBackRes = pgd.hook.pullBack();
        if (!!pullBackRes)
            return pullBackRes;
        let theMine = this.mines[mineKey];
        if (!theMine)
            return 0;
        pgd.hook.setItem(theMine.itemId);
        this.reborn(mineKey, theMine.rebornTime);
        theMine.empty();
        return 0;
    }

    getFromHook(uid) {
        let res = [];
        let pgd = this.players[uid];
        if (!pgd) {
            res[0] = Game.GAME_CODE.NO_THIS_PLAYER;
            return res;
        }
        let hookItemId = pgd.hook.itemId;
        pgd.hook.reset();
        if (!hookItemId)
            return res;
        let hookItemInfo = staticData.getDataById('minerItem', hookItemId);
        if (!hookItemInfo)
            return res;
        res[1] = hookItemId;
        pgd.score += Number.parseInt(hookItemInfo['score']);
        if (!hookItemInfo['type'])
            return res;
        pgd.addSkill(hookItemInfo['skillId']);
        return res;
    }

    useTool(uid, toolIdx) {
        let res = [];
        let pgd = this.players[uid];
        if (!pgd) {
            res[0] = Game.GAME_CODE.NO_THIS_PLAYER;
            return res;
        }
        let skillId = pgd.popToolByIdx(toolIdx);
        if (!skillId) {
            res[0] = Game.GAME_CODE.NO_THIS_TOOL;
            return res;
        }
        // 0->toolIdx 道具位置, 1->skillType 技能类型, 2->userId 技能目标, 3->bool 是否起效
        let intValue = [];
        intValue[0] = toolIdx;
        let skill = staticData.getDataById('minerSkill', skillId);
        intValue[1] = skill['type'];
        if (!skill['aim']) {
            intValue[2] = uid;
            intValue[3] = 1;
        } else {
            let otherUid = this._getOtherUserId(uid);
            intValue[2] = otherUid;
            // 一共就俩技能道具,不做类型判断,但如果要新增新的道具类型,请具体实现道具效果
            let otherPlayer = this.players[otherUid];
            if (!!otherPlayer.hook.itemId) {
                otherPlayer.hook.reset();
                intValue[3] = 1;
            }
        }
        res[1] = intValue;
        return res;
    }

    reborn(id, rebornTime) {
        setTimeout(()=>{
            if (this.status == Game.GAME_STATUS.STOP)
                return;
            let theMine = this.mines[id];
            theMine.reborn(id);
            this.event.emit(Game.EVENT_NAME.BORN_ITEM, theMine.toClient());
        }, rebornTime);
    }

    _getOtherUserId(uid) {
        for (let tempUid in this.players) {
            if (!this.players.hasOwnProperty(tempUid))
                continue;
            if (uid != tempUid)
                return tempUid;
        }
    }
}

Game.GAME_STATUS = {
    INIT  :   0,
    START :   1,
    STOP  :   2
};
Game.GAME_CODE = {
    NO_THIS_PLAYER  : 10001,    // 无此玩家
    HOOK_OUT_STATUS : 10002,    // 钩子状态不对
    NO_THIS_ITEM    : 10003,    // 无此道具
    FULL_TOOL       : 10004,    // 道具已满
    NOT_TOOL        : 10005,    // 不是道具
    NO_THIS_TOOL    : 10006,    // 无此道具
};
Game.EVENT_NAME = {
    BORN_ITEM : 'bornItem',
};

module.exports = Game;