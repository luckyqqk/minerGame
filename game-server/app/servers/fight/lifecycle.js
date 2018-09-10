const Lifecycle = module.exports;

Lifecycle.beforeStartup = function(app, cb) {
    // .setSign(app.getServerId());
    cb();
};

Lifecycle.beforeShutdown = function(app, cb) {
    // app.get('matchingQueue').stop();
    cb();
};

Lifecycle.afterStartup = function(app, cb) {
    cb();
};

Lifecycle.afterStartAll = function(app) {
    const GameMgr = require('../../controller/gameMgr');
    app.set('gameMgr', new GameMgr(), true);
};

Lifecycle.beforeShutdown = function(app, cb) {
    cb();
};
