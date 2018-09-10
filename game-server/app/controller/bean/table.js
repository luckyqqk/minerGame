/**
 * Created by qingkai.wu on 2018/8/1.
 */
const STATUS = require('../../code/status');

class Table {
    constructor(tableId, tableToken) {
        this.id = tableId;
        this.tableToken = tableToken;
        this.status = STATUS.TABLE.WAITING;
        this.gameLogic = null;
    }

    setGameLogic(logic) {
        this.gameLogic = logic;
    }

    addFighter(uid, frontendId, ai) {
        return this.gameLogic.addFighter(uid, frontendId, ai);
    }

    doGameStart(data) {
        this.status = STATUS.TABLE.STARTED;
        this.gameLogic.broadcast('onGameStart', data);
    }

    timeOver() {
        this.gameLogic._gameOver();
    }

    doGameOver(data) {
        this.status = STATUS.TABLE.OVER;
        this.gameLogic.broadcast('onGameOver', data);
        this.gameLogic.channel.destroy();
    }

    doOperator(uid, msg) {
        return this.gameLogic.doOperator(uid, msg);
    }

    broadcast(route, msg, opts, cb) {
        if (!this.gameLogic) {
            if (!!cb) cb();
            return;
        }
        this.gameLogic.broadcast(route, msg, opts, cb);
    }
}

module.exports = Table;