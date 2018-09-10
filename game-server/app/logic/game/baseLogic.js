/**
 * Created by qingkai.wu on 2018/8/1.
 */

const pomelo = require('pomelo');
const channelService = pomelo.app.get('channelService');
const Fighter = require('./bean/fighter');
const CODE = require('../../code/code');
const STATUS = require('../../code/status');
class BaseLogic {
    constructor(tableId, event) {
        this.channel = channelService.getChannel(tableId, true);
        this.tableId = tableId;
        this.event = event;

        this.uids = [];
        this.team = {};
        this.fighters = {};
    }

    addFighter(uid, frontendId, ai) {
        this.uids.push(uid);
        let length = this.uids.length;
        this.team[uid] = length;
        this.fighters[uid] = new Fighter(uid, frontendId, ai);
        if (!!frontendId) {
            this.channel.add(uid, frontendId);
            // console.error(`this.channel.name:${this.channel.name}`);
            // console.error(this.channel.getMembers());
        }

        if (length == 2)
            this._gameStart();
    }

    broadcast(route, msg, opts, cb) {
        this.channel.pushMessage(route, msg, opts, cb);
    }

    _gameStart() {
        this.event(STATUS.EVENT.GAME_START, this.tableId, {team:this.team});
    }

    _gameOver(data) {
        this.event(STATUS.EVENT.GAME_OVER, this.tableId, data);
    }

    doOperator(msg) {
        return new Promise((resolve, reject)=>{
            this.broadcast('onOperator', msg, null, err=>{
                if (!!err) {
                    reject(CODE.COMMON.SYS_ERR);
                    console.error('broadcast err : %j', err.stack);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = BaseLogic;