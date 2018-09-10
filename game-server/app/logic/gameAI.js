/**
 * Created by qingkai.wu on 2018/8/1.
 */
const fs = require('fs');
const path = require('path');
const root = __dirname + '/AIs';
const GameLogic = function() {
    fs.readdirSync(root).forEach(filename=>{
        if (!/\.js$/.test(filename)) {
            return;
        }
        let name = path.basename(filename, '.js');
        this[name] = new require(root + "/" + name);
    });
    // console.error(this);
};

module.exports = new GameLogic();