/**
 * Created by qingkai.wu on 2018/8/1.
 */
const staticData = require('json2memory');
const CODE = require('../code/code');
const TableMgr = require('./tableMgr');
const GameMgr = function() {
    this.tableMgrs = {};

    const gameTypes = staticData.getData('gameType');
    for (let key in gameTypes) {
        if (!gameTypes.hasOwnProperty(key))
            continue;
        this.tableMgrs[key] = new TableMgr(gameTypes[key]);
    }
};

module.exports = GameMgr;

GameMgr.prototype.doFunc = function(msg, session, funcName) {
    return new Promise((resolve, reject)=>{
        // let uid = session.uid;
        let gameType = session.get('gameType');
        let tableMgr = this.tableMgrs[gameType];
        if (!tableMgr) {
            reject(CODE.GAME.UN_SUPPORT_TYPE);
            return;
        }
        tableMgr[funcName](msg, session).then(resolve).catch(reject);
    });
};