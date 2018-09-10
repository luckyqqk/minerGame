/**
 * Created by qingkai.wu on 2018/8/1.
 */

const Controller = module.exports;
const CODE = require('../code/code');
Controller.login = function(msg, session, app) {
    return new Promise((resolve, reject)=>{
        let uid = msg['uid'];
        let gameType = msg['gameType'];

        if (!uid || !gameType) {
            reject(CODE.COMMON.PARAM_ERR);
            return;
        }
        session.bind(uid);
        session.set('gameType', gameType);
        session.set('frontendId', app.getServerId());
        session.pushAll((err)=>{
            if(!!err) {
                reject(CODE.COMMON.SYS_ERR);
                console.error('set all for session service failed! error is : %j', err.stack);
            } else {
                resolve();
            }
        });
        session.on('closed', onUserLeave.bind(null, app));
    });
};

function onUserLeave(app, session) {
    if(!session || !session.uid) {
        return;
    }
    app.rpc.fight.fightRemote.onUserLeave(session, session.uid, session.get('gameType'), session.get('tableId'), null);
    // app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
}