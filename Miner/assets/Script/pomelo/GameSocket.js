const Constant = require('Constant');
const GameSocket = module.exports;

function _socketInit (host, port, cb) {
    pomelo.init({
        host: host,	// window.location.hostname
        port: port,
        log: true
    }, cb);
}

function _getConnection(uid) {
    return new Promise((resolve, reject)=>{
        pomelo.request('gate.gateHandler.queryEntry', {uid:uid}, data=>{
            pomelo.disconnect(()=>{
                if (!data.code == 200)
                    reject(data.code);
                else
                    resolve(data);
            });
        });
    });
}

GameSocket.loginGameServer = function(uid) {
    return new Promise((resolve, reject)=>{
        _socketInit(Constant.SERVER.HOST, Constant.SERVER.PORT, ()=>{
            _getConnection(uid).then(data=>{
                _socketInit(data.host, data.port, ()=>{
                    pomelo.request("connector.entryHandler.enter", {
                        uid     : uid,
                        gameType: Constant.SERVER.GAME_TYPE
                    }, data=>{
                        if (data.code != 200)
                            reject(data.code);
                        else
                            resolve(data);
                    });
                });
            }).catch(reject);
        });
    });
};

GameSocket.addGameListener = function(route, cb) {
    pomelo.on(route, cb);
};

GameSocket.readyFight = function(gameId, tableId, tableToken, robotId) {
    return new Promise((resolve, reject)=>{
        pomelo.request('fight.fightHandler.readyFight', {gameId:gameId, tableId:tableId, tableToken:tableToken, robotId:robotId}, (data)=>{
            if (data.code != 200)
                reject(data.code);
            else
                resolve(data);
                // cc.error(`start game failed:${Constant.GAME_CODE[data.code]}`);
        })
    });
};

GameSocket.doOperator = function(param) {
    return new Promise((resolve, reject)=>{
        pomelo.request('fight.fightHandler.doOperator', param, (data)=>{
            if (data.code != 200)
                reject(data.code);
            else
                resolve(data);
        })
    });
};




