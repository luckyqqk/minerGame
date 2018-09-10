const dispatcher = require('../../../util/dispatcher');

module.exports = function(app) {
	return new Handler(app);
};

const Handler = function(app) {
	this.app = app;
};

const handler = Handler.prototype;

/**
 * Gate handler that dispatch user to connectors.
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param {Function} next next stemp callback
 *
 */
handler.queryEntry = function(msg, session, next) {
	let uid = msg.uid;
	if(!uid) {
		next(null, {
			code: 500
		});
		return;
	}
	// get all connectors
    let connectors = this.app.getServersByType('connector');
	if(!connectors || connectors.length === 0) {
		next(null, {
			code: 500
		});
		return;
	}
	// select connector
	let key = typeof uid == 'string' ? uid : uid.toString();
    let res = dispatcher.dispatch(key, connectors);
	next(null, {
		code: 200,
		host: res['clientHost'],
		port: res['clientPort']
	});
};
