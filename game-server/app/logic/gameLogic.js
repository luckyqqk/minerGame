/**
 * Created by qingkai.wu on 2018/8/1.
 */
const fs = require('fs');
const path = require('path');
const logicRoot = __dirname + '/game';
const GameLogic = function() {
    fs.readdirSync(logicRoot).forEach(filename=>{
        if (!/\.js$/.test(filename)) {
            return;
        }
        let name = path.basename(filename, '.js');
        this[name] = new require(logicRoot + "/" + name);
    });
    // console.error(this);
};

module.exports = new GameLogic();