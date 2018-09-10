/**
 * Created by qingkai.wu on 2018/8/1.
 */
const EventEmitter = require('events').EventEmitter;
const GameLogic = require('../logic/gameLogic');
const GameAI = require('../logic/gameAI');
const Table = require('./bean/table');
const STATUS = require('../code/status');
const CODE = require('../code/code');
const logger = require('pomelo-logger').getLogger(__filename, 'pomelo');
class BaseTableMgr {
    constructor(gameType) {
        this.gameType = gameType;
        this.event = new EventEmitter();
        this.tables = {};

        // this.event.on(STATUS.EVENT.TABLE_NEW, (tableId)=>{});
        this.event.on(STATUS.EVENT.GAME_START, (tableId, data)=>{
            let table = this.tables[tableId];
            let timeOver = this.gameType['timeOver'];
            if (!!timeOver) {
                data['timeDown'] = timeOver;
                setTimeout(table.timeOver.bind(table), timeOver);
            }
            table.doGameStart(data);
        });
        this.event.on(STATUS.EVENT.GAME_OVER, (tableId, data)=>{
            this.tables[tableId].doGameOver(data);
            delete this.tables[tableId];
        });
    }

    readyFight(msg, session) {
        return new Promise((resolve, reject)=>{
            let tableId = msg['tableId'];
            let theTable = this.tables[tableId];
            if (!theTable) {
                let tableSecret = msg['tableToken'] || Math.floor(100 + Math.random() * 1000);

                theTable = new Table(tableId, tableSecret);
                let logicName = this.gameType['logic'];
                let aimLogic = GameLogic[logicName];
                theTable.setGameLogic(new aimLogic(tableId, this.event));
                this.tables[tableId] = theTable;
            }
            if (theTable.status != STATUS.TABLE.WAITING) {
                reject(CODE.GAME.TABLE_NOT_WAIT);
                return;
            }
            session.set('tableId', tableId);
            session.push('tableId', err=>{
                if (!!err) {
                    reject(CODE.COMMON.SYS_ERR);
                    logger.error('push tableId failed, %j', err.stack);
                } else {
                    let uid = session.uid;
                    let frontendId = session.get('frontendId');
                    theTable.addFighter(uid, frontendId);
                    if (!!msg['robotId']) {
                        let ai = null;
                        if (!!this.gameType['ai'] && !!GameAI[this.gameType['ai']])
                            ai = new GameAI[this.gameType['ai']]();
                        theTable.addFighter(msg['robotId'], 0, ai);
                    }
                    resolve();
                }
            });
        });
    }

    doOperator(msg, session) {
        return new Promise((resolve, reject)=>{
            let tableId = session.get('tableId');
            let theTable = this.tables[tableId];
            if (!theTable || theTable.status != STATUS.TABLE.STARTED) {
                reject(CODE.GAME.TABLE_NOT_OPEN);
                return;
            }
            theTable['doOperator'](session.uid, msg).then(resolve).catch(reject);
        });
    }
}

module.exports = BaseTableMgr;