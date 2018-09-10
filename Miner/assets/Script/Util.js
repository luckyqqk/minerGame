/**
 * Created by qingkai.wu on 2018/8/24.
 */

const Util = module.exports;

Util.createNodeByPrefab = function(prefabAdr, cb) {
    cc.loader.loadRes(prefabAdr, (err, data)=>{
        if (!!err)
            cb(err);
        else if (!data instanceof cc.Prefab)
            cb(`${prefabAdr} is not prefab file`);
        else
            cb(null, cc.instantiate(data));
    })
};