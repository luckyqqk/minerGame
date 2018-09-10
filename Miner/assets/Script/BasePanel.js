
/*
* 窗口基类 继承于cc.Component
* 目前简单touch事件处理
* */


///////

/*
* 是停止传递事件 默认停止传递
*
* 和onTouchsEvent();方法配合使用
* */
var stopPropagation = true;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    ctor: function () {

        this.setStopPropagation(true);
    },

    /*
    * 设置是否停止传递
    * */
    setStopPropagation: function (stop) {
        stopPropagation = stop;
    },
    /*
    * 获取传递状态
    * */
    isStopPropagation: function () {
        return stopPropagation;
    },
    /*
    * 注册Touchs事件
    * @param node 事件绑定节点
    * */
    onTouchEvent: function (node) {
        node.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.onTouchStart(event);
            if(stopPropagation)
                event.stopPropagation();
        }.bind(this), node);
        node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.onTouchMove(event);
            if(stopPropagation)
                event.stopPropagation();
        }.bind(this), node);
        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.onTouchEnd(event);
            if(stopPropagation)
                event.stopPropagation();
        }.bind(this), node);
        node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.onTouchCancel(event);
            if(stopPropagation)
                event.stopPropagation();
        }.bind(this), node);

    },

    /*
    * Touch事件 开始回调
    * */
    onTouchStart: function (event) {


    },
    /*
    * Touch事件 移动回调
    * */
    onTouchMove: function (event) {


    },
    /*
    * Touch事件 抬起回调
    * */
    onTouchEnd: function (event) {


    },
    /*
    * Touch事件 失效回调
    * */
    onTouchCancel: function (event) {


    }


    







    
});