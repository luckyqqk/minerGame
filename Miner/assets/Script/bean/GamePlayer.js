cc.Class({
    extends: cc.Component,

    properties: {
        score       : cc.Label,
        hook        : cc.Node,
        toolLeft    : cc.Node,
        toolRight   : cc.Node,
        role        : cc.Node,
        roleBomb    : cc.Node,
    },

    onLoad () {
        this.scoreNum = 0;
        this.hookHomeplace = this.hook.position;
        this.scoreComp = this.score.getComponent(cc.Label);
        this.hookComp = this.hook.getComponent("Hook");
        this.toolLeft = this.toolLeft.getComponent("Tool");
        this.toolRight = this.toolRight.getComponent("Tool");
        // this.roleBomb = this.roleBomb.getComponent("Tool");
    },

    start () {
    },

    onGameStart() {
        this.hookComp.onGameStart();
    },

    onGameOver() {
        this.hookComp.onGameOver();
    },
    // update (dt) {},

    setUid(uid) {
        this.uid = uid;
        this.hookComp.setUid(uid);
    },

    sendThrowHook() {
        this.hookComp.sendThrowHook();
    },

    throwHook(intArr) {
        this.hookComp.throwOut(intArr);
    },

    holdItem(mineCamp) {
        this.hookComp.holdItem(mineCamp);
    },

    getItemFromHook(intValue) {
        let theMineCamp = this.hookComp.getItemFromHook(intValue);
        if (!theMineCamp)
            return;
        switch (theMineCamp['type']) {
            case 0:
                let actOver = cc.callFunc(function() {
                    this.scoreNum += theMineCamp['score'];
                    this.scoreComp.string = this.scoreNum;
                }, this);

                let aimPos = this.scoreComp.node.parent.convertToWorldSpaceAR(this.scoreComp.node.position);
                let spa = cc.spawn(cc.moveTo(1, aimPos), cc.fadeOut(1));
                theMineCamp.node.runAction(cc.sequence(spa, cc.removeSelf(true), actOver));
                break;
            case 1:
                let actOver2 = cc.callFunc(function() {
                    this.scoreNum += theMineCamp['score'];
                    this.scoreComp.string = this.scoreNum;
                }, this);

                let toolCamp = null;
                if (this.toolLeft.addItemCamp(theMineCamp)) {
                    toolCamp = this.toolLeft;
                } else if (this.toolRight.addItemCamp(theMineCamp)) {
                    toolCamp = this.toolRight;
                } else {
                    theMineCamp.node.runAction(cc.sequence(cc.removeSelf(true), actOver2));
                    return;
                }
                theMineCamp.node.setScale(cc.v2(0.6, 0.6));
                let aimPos2 = this.node.convertToWorldSpaceAR(toolCamp.node.position);
                theMineCamp.node.runAction(cc.sequence(cc.moveTo(1, aimPos2), actOver2));
                break;
        }

    },

    checkToolClick(touchPos) {
        let clickToolIdx = -1;
        if (this.toolLeft.checkToolClick(touchPos))
            clickToolIdx = 0;
        else if (this.toolRight.checkToolClick(touchPos))
            clickToolIdx = 1;
        return clickToolIdx;
    },

    useTool(toolIdx, aimPos) {
        return new Promise((resolve, reject)=>{
            let toolForJump = !toolIdx ? this.toolLeft : this.toolRight;
            toolForJump.useItem(aimPos).then(resolve).catch(reject);
        });
    },

    onBomb(effect) {
        this._showRoleBomb();
        if (!!effect)
            this.hookComp.onBomb();
    },

    onMagnet() {
        this.hookComp.onMagnet();
    },

    // effectSkill(skillType, isEffect) {
    //     this.hookComp.effectSkill(skillType, isEffect);
    //     switch (skillType) {
    //         case 1:
    //             this._showRoleBomb();
    //             break;
    //         case 2:
    //             break;
    //     }
    // },

    _showRoleBomb() {
        this.roleBomb.active = true;
        this.role.active = false;
        setTimeout(this._hideRoleBomb.bind(this), 2000);
    },
    _hideRoleBomb() {
        this.role.active = true;
        this.roleBomb.active = false;
    }
});
