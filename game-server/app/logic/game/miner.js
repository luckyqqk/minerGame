/**
 * Created by qingkai.wu on 2018/8/20.
 */

const EventEmitter = require('events').EventEmitter;
const STATUS = require('../../code/status');
const baseLogic = require('./baseLogic');
const MinerGame = require('./bean/minerGame');

class Miner extends baseLogic {
    constructor(tableId, event) {
        super(tableId, event);
        this.gameEvent = new EventEmitter();
    }

    _gameStart() {
        this.game = new MinerGame(this.gameEvent);
        this.game.init(this.uids);
        this.game.start();
        this.event.emit(STATUS.EVENT.GAME_START, this.tableId, {mine:this.game.getMines(), team:this.team});

        this.gameEvent.on(MinerGame.EVENT_NAME.BORN_ITEM, data=>{
            this.broadcast('onReborn', data);
        });
    }

    _gameOver() {
        this.event.emit(STATUS.EVENT.GAME_OVER, this.tableId, this.game.stop());
    }

    doOperator(uid, msg) {
        return new Promise((resolve, reject)=>{
            let type = msg['type'];
            let intValue = msg['intValue'] || [];
            let code = null;
            switch (type) {
                case Miner.ACTION.C2S_THROW_HOOK:
                    code = this.game.throwHook(uid);
                    break;
                case Miner.ACTION.C2S_HOLD_ITEM:
                    code = this.game.holdItem(uid, intValue[0], intValue[1]);
                    break;
                case Miner.ACTION.C2S_GET_HOOK:
                    let receiveHookRes = this.game.getFromHook(uid);
                    code = receiveHookRes[0];
                    if (!!receiveHookRes[1])
                        intValue.push(receiveHookRes[1]);
                    break;
                case Miner.ACTION.C2S_USE_TOOL:
                    let useToolRes = this.game.useTool(uid, intValue[0]);
                    code = useToolRes[0];
                    if (!!useToolRes[1])
                        intValue = useToolRes[1];
                    break;
                default:
                    break;
            }
            if (!!code) {
                reject(code);
                return;
            }
            this.broadcast('onOperator', {type:type + 100, uid:uid, intValue:intValue});
            resolve();
        });
    }
}
Miner.ACTION = {
    C2S_THROW_HOOK : 101,
    C2S_HOLD_ITEM  : 102,
    C2S_GET_HOOK   : 103,
    C2S_USE_TOOL   : 104,

    S2C_THROW_HOOK : 201,
    S2C_HOLD_ITEM  : 202,
    S2C_GET_HOOK   : 203,
    S2C_USE_TOOL   : 204,
};

module.exports = Miner;