const exp = module.exports;
const dispatcher = require('./dispatcher');

exp.fight = function(session, msg, app, cb) {
	let gameType = session.get('gameType');
	if (!gameType) {
        cb(new Error('can not find gameType.'));
		return;
	}
	let servers = app.getServersByType('fight');
	if(!servers || servers.length === 0) {
		cb(new Error('can not find fight servers.'));
		return;
	}
	let key = typeof gameType == 'string' ? gameType : gameType.toString();
	let res = dispatcher.dispatch(key, servers);
	cb(null, res.id);
};