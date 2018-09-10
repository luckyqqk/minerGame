"use strict";
cc._RF.push(module, 'adb79hcItJG5KxAiy39Y0gs', 'UserInfo');
// Script/bean/UserInfo.js

'use strict';

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
        head: cc.Sprite,
        gender: cc.Sprite
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

    setNickname: function setNickname(nick) {
        if (!!nick) this.nickname.string = nick;
    },
    setGender: function setGender(gender) {
        var _this = this;

        if (gender != 'f') return;
        cc.loader.loadRes('ui/girl_icon.png', cc.SpriteFrame, function (err, spriteFrame) {
            _this.gender.spriteFrame = spriteFrame;
        });
    },

    setUserHead: function setUserHead(url) {
        var _this2 = this;

        console.log('头像地址' + url);
        if (!url) return;
        cc.loader.load({
            url: url,
            type: 'jpg'
        }, function (err, texture) {
            if (!!err) {
                console.log('加载玩家头像错误 === ', err);
                return;
            }
            var w = texture.width;
            var h = texture.height;
            var bgw = _this2.head.node.width;
            var bgh = _this2.head.node.height;
            var wScale = bgw / w;
            var hScale = bgh / h;
            _this2.head.node.setScale(wScale, hScale);
            _this2.head.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

    // onLoad () {},
    // start () {},
    // update (dt) {},
});

cc._RF.pop();