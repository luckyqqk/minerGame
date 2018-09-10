var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'oppoGameServer');

// app configuration
app.configure('production|development', 'connector', function(){
    app.set('connectorConfig',
        {
            connector : pomelo.connectors.hybridconnector,
            heartbeat : 30,
            timeout	  : 35,
            useDict   : true,
            useProtobuf : true
        });
    app.route('fight', routeUtil.fight);
});

app.configure('production|development', 'gate', function(){
    app.set('connectorConfig',
        {
            connector : pomelo.connectors.hybridconnector,
            heartbeat : 30,
            timeout	  : 35,
            useDict   : true,
            useProtobuf : true
        });
});

// app configure
app.configure('production|development', function() {
	app.filter(pomelo.timeout());
});

app.start();

process.on('uncaughtException', function(err) {
	console.error(' Caught exception: ' + err.stack);
});

process.on('unhandledRejection', function(err) {
    console.error('<Rejection>: ' + err);
});