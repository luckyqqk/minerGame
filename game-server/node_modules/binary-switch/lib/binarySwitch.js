/**
 * Created by wuqingkai on 17/8/21.
 */

var BinarySwitch = function() {
    this._binary = 0;
};
module.exports = BinarySwitch;

var pro = BinarySwitch.prototype;

pro.setBinary = function(state) {
    state = +state.toString();
    if (isNaN(state))
        state = 0;
    return this._binary = state;
};

pro.getBinary = function() {
    return this._binary;
};

pro.reset = function() {
	return this._binary = 0;
};

pro.on = function(idx) {
    return this._binary |= 1 << idx;
};

pro.off = function(idx) {
    return this._binary ^= 1 << idx;
};

pro.isOn = function(idx) {
    return (this._binary & (1 << idx)) != 0;
};

pro.isOff = function(idx) {
    return (this._binary & (1 << idx)) == 0;
};