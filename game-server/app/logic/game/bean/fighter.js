/**
 * Created by qingkai.wu on 2018/8/1.
 */
class Fighter {
    constructor(uid, frontendId, ai) {
        this.uid = uid;
        this.frontendId = frontendId;
        this.ai = ai;
        this.result = 0;
    }
}

module.exports = Fighter;