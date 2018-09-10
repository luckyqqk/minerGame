(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/pomelo/GameSocket.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ba592vCUFtKTrJ2wqi27aOS', 'GameSocket', __filename);
// Script/pomelo/GameSocket.js

'use strict';

var Constant = require('Constant');
var GameSocket = module.exports;

function _socketInit(host, port, cb) {
    pomelo.init({
        host: host, // window.location.hostname
        port: port,
        log: true
    }, cb);
}

function _getConnection(uid) {
    return new Promise(function (resolve, reject) {
        pomelo.request('gate.gateHandler.queryEntry', { uid: uid }, function (data) {
            pomelo.disconnect(function () {
                if (!data.code == 200) reject(data.code);else resolve(data);
            });
        });
    });
}

GameSocket.loginGameServer = function (uid) {
    return new Promise(function (resolve, reject) {
        _socketInit(Constant.SERVER.HOST, Constant.SERVER.PORT, function () {
            _getConnection(uid).then(function (data) {
                _socketInit(data.host, data.port, function () {
                    pomelo.request("connector.entryHandler.enter", {
                        uid: uid,
                        gameType: Constant.SERVER.GAME_TYPE
                    }, function (data) {
                        if (data.code != 200) reject(data.code);else resolve(data);
                    });
                });
            }).catch(reject);
        });
    });
};

GameSocket.addGameListener = function (route, cb) {
    pomelo.on(route, cb);
};

GameSocket.readyFight = function (gameId, tableId, tableToken, robotId) {
    return new Promise(function (resolve, reject) {
        pomelo.request('fight.fightHandler.readyFight', { gameId: gameId, tableId: tableId, tableToken: tableToken, robotId: robotId }, function (data) {
            if (data.code != 200) reject(data.code);else resolve(data);
            // cc.error(`start game failed:${Constant.GAME_CODE[data.code]}`);
        });
    });
};

GameSocket.doOperator = function (param) {
    return new Promise(function (resolve, reject) {
        pomelo.request('fight.fightHandler.doOperator', param, function (data) {
            if (data.code != 200) reject(data.code);else resolve(data);
        });
    });
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=GameSocket.js.map
        