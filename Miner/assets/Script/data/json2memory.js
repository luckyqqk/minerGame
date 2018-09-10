/**
 * Created by qingkai.wu on 2018/8/22.
 */
const Json2memory = function() {
    this.jsonFile = {};
};

Json2memory.prototype.loadJson = function() {
    return new Promise((resolve, reject)=>{
        cc.loader.loadResDir("json", (err, data)=>{
            if (!!err) {
                reject(err);
                return;
            }
            data.forEach(jsonAsset=>{
                this.jsonFile[jsonAsset.name] = jsonAsset.json;
            });
            resolve();
        });
    });
};

Json2memory.prototype.getData = function(fileName) {
    return this.jsonFile[fileName];
};

Json2memory.prototype.getDataById = function(fileName, id) {
    return this.jsonFile[fileName][id];
};

window.JsonData = new Json2memory();