const Login = require('../../../logic/login');
const CODE = require('../../../code/code');
module.exports = function(app) {
	return new Handler(app);
};

const Handler = function(app) {
		this.app = app;
};

const handler = Handler.prototype;

handler.enter = function(msg, session, next) {
    Login.login(msg, session, this.app).then(data=>{
		next(null, {code:CODE.COMMON.SUCCESS, data : data});
	}).catch(err=>{
        console.error('login failed! error is : %j', err.stack);
        next(null, {code:CODE.COMMON.SYS_ERR});
	});
};
