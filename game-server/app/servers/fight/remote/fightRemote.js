/**
 * Created by qingkai.wu on 2018/8/1.
 */
module.exports = function(app) {
    return new Remote(app);
};

const Remote = function(app) {
    this.app = app;
    // this.channelService = app.get('channelService');
};

Remote.prototype.onUserLeave = function(uid, gameType, tableId, cb) {
    if (!!cb)
        cb();
};