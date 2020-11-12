"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const iconv = require("iconv-lite");
// 发起 GET 请求
const request = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let chunks = [];
            if (!res || res.statusCode !== 200) {
                reject(new Error('网络请求错误!'));
                return;
            }
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
                // Sometimes the 'error' event is not fired. Double check here.
                if (res.statusCode === 200) {
                    let buff = Buffer.concat(chunks);
                    const contentType = res.headers['content-type'] || '';
                    const matchCharset = contentType.match(/(?:charset=)(\w+)/) || [];
                    // 转编码，保持跟响应一致
                    let body = iconv.decode(buff, matchCharset[1] || 'utf8');
                    resolve(body);
                }
                else {
                    reject('网络请求错误!');
                }
            });
            // res.on('end', () => resolve(chunks));
        });
    });
});
// 根据基金代码请求基金数据
function fundApi(codes) {
    // 请求列表
    const promises = codes.map((code) => {
        const url = `https://hq.sinajs.cn/list=${code}`;
        return request(url);
    });
    return Promise.all(promises).then((results) => {
        const resultArr = [];
        results.forEach((rsp) => {
            const itemArr = rsp.split('="')[1].split(',');
            const code = rsp.split('="')[0].split('hq_str_')[1];
            const changeAmount = (((parseFloat(itemArr[3]) - parseFloat(itemArr[2])) / parseFloat(itemArr[2])) * 100).toFixed(2);
            const info = {
                name: itemArr[0],
                todayOpen: itemArr[1],
                lastClose: itemArr[2],
                nowPrice: itemArr[3],
                hightPrice: itemArr[4],
                lowPrice: itemArr[5],
                code: code,
                fullcode: code,
                changeAmount: changeAmount
            };
            resultArr.push(info);
        });
        return resultArr;
    });
}
exports.default = fundApi;
//# sourceMappingURL=api.js.map