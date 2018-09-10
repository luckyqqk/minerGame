/**
 * Created by qingkai.wu on 2018/8/1.
 */
const STATUS_CODE = require('../../../code/code');
module.exports = function(app) {
    return new Handler(app);
};

const Handler = function(app) {
    this.app = app;
    this.gameMgr = app.get('gameMgr');
};

/**
 * 参与游戏的玩家一定要点击准备,无论游戏是否已经开始
 * @param msg
 * @param session
 * @param next
 */
Handler.prototype.readyFight = function(msg, session, next) {
    this.gameMgr.doFunc(msg, session, 'readyFight').then(()=>{
        next(null, {code: STATUS_CODE.COMMON.SUCCESS});
    }).catch(code=>{
        next(null, {code: code});
    });
};

/**
 * 接受玩家游戏动作
 * @param msg
 * @param session
 * @param next
 */
Handler.prototype.doOperator = function(msg, session, next) {
    this.gameMgr.doFunc(msg, session, 'doOperator').then(()=>{
        next(null, {code: STATUS_CODE.COMMON.SUCCESS});
    }).catch(code=>{
        next(null, {code: code});
    });
};

/**
 * 玩家断线重连后,获取桌面数据
 * @param msg
 * @param session
 * @param next
 */
Handler.prototype.getTableData = function(msg, session, next) {
    this.gameMgr.doFunc(msg, session, 'getTableData').then((data)=>{
        next(null, {code: STATUS_CODE.COMMON.SUCCESS, data:data});
    }).catch(code=>{
        next(null, {code: code});
    });
};