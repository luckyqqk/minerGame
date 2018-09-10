/**
 * Created by qingkai.wu on 2018/7/17.
 */

const STATUS = module.exports;
// STATUS.PLAYER = {
//     IN_HALL         :   0,              // 大厅中
//     IN_TEAM         :   1,              // 队伍中
//     ON_MATCHING     :   2,              // 匹配中
//     ON_FIGHTING     :   3,              // 战斗中
// };
STATUS.PLATFORM = {
    HOST        : "http://59.110.229.196",
    PORT        : 18080,
    // GAME_ID     : 818109807,
    GAME_KEY    : "123456trewq",
    GAME_SECRET : "123456trewq",
    GAME_START  : '/jeekegame/battle/gameapi/gameStart',
    GAME_END    : '/jeekegame/battle/gameapi/gameEnd',
    VERSION     : '1.0.0',
};
// 游戏开始
// 参数含义类型是否为空备注
// version 接⼜版本号整数⾮空
// gameId 游戏Id 整数⾮空游戏Id
// roomId 房间Id 整数可空房间Id
// roomKey 房间key 整数⾮空房间key
// userIdList 玩家列表userIdList (Integer
// 数组):所有玩家id
// 整数列表⾮空
// timeStamp 时间戳，毫秒整数⾮空时间戳，毫秒
// sign 签名字符串⾮空签名，⽣成⽅式参考⽂末
// extension 扩展字段字符串可空扩展字段

// 参数含义类型是否为空备注
// errorCode 错误码,参考⽂末整数⾮空
// errorMsg 错误描述字符串⾮空结果描述
// extension 透传扩展字段字符串可空透传扩展字段

// 游戏结束
// 参数含义类型是否为空备注
// version 接⼜版本号整数⾮空接⼜版本号
// gameId 游戏Id 整数⾮空游戏Id
// roomId 对战房间Id 整数可空对战房间Id
// roomKey 房间key 整数⾮空房间key
// resultList 对战结果resultList列表对象列表⾮空见下⽂
// timeStamp 时间戳，毫秒整数⾮空时间戳，毫秒
// sign 签名字符串⾮空签名，⽣成⽅式参考⽂末
// extension 扩展字段字符串可空扩展字段

// resultList
// 参数含义类型是否为空备注
// userId ⽤户ID 整数⾮空⽤户ID
// result 玩家输赢整数⾮空输赢(1获胜,2失败,3平局)

STATUS.EVENT = {
    TABLE_NEW       :   'onTableNew',   // 游戏桌子创建
    GAME_START      :   'onGameStart',  // 游戏开始
    GAME_OVER       :   'onGameOver',   // 游戏结束
};

STATUS.TABLE = {
    WAITING : 0,
    STARTED : 1,
    OVER    : 2
};

STATUS.FIGHTER_RESULT = {
    WIN     : 1,    //1获胜
    LOSE    : 2,    //2失败
    DRAW    : 3     //3平局
};