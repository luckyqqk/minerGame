/**
 * Created by qingkai.wu on 2018/4/26.
 */

const CODE = module.exports;

CODE.COMMON = {
    SUCCESS         :   200,            // 成功
    FAIL            :   700,            // 失败
    NO_REGISTER     :   600,            // 未注册
    NOT_LOGIN       :   601,            // 未登陆
    PARAM_NONE      :   602,            // 空参数
    PARAM_ERR       :   603,            // 参数错误
    SYS_ERR         :   999,            // 系统异常
    NO_ACCOUNT      :   1000            // 未传入账号
};

CODE.GAME = {
    UN_SUPPORT_TYPE :   1001,           // 不支持的游戏类型
    TABLE_NOT_WAIT  :   1002,           // 游戏不是等待状态
    TABLE_NOT_OPEN  :   1003,           // 游戏不是开始状态
};