// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        nickname: cc.Label,
        head    : cc.Sprite,
        gender  : cc.Sprite,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    setNickname(nick) {
        if (!!nick)
            this.nickname.string = nick;
    },

    setGender(gender) {
        if (gender != 'f')
            return;
        cc.loader.loadRes('ui/girl_icon.png', cc.SpriteFrame, (err, spriteFrame)=>{
            this.gender.spriteFrame = spriteFrame;
        });
    },
    setUserHead: function (url) {
        console.log('头像地址'+url);
        if (!url)
            return;
        cc.loader.load({
            url: url,
            type: 'jpg'
        }, (err, texture)=>{
            if (!!err) {
                console.log('加载玩家头像错误 === ', err);
                return;
            }
            let w = texture.width;
            let h = texture.height;
            let bgw = this.head.node.width;
            let bgh = this.head.node.height;
            let wScale = bgw / w;
            let hScale = bgh / h;
            this.head.node.setScale(wScale,hScale);
            this.head.spriteFrame = new cc.SpriteFrame(texture);
        });
    },

    // onLoad () {},
    // start () {},
    // update (dt) {},
});
