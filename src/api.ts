import * as https from 'https';
import * as iconv from 'iconv-lite';
// 发起 GET 请求
const request = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let chunks: Array<Buffer> = [];
      if (!res || res.statusCode !== 200) {
        reject(new Error('网络请求错误!'));
        return;
      }
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        // Sometimes the 'error' event is not fired. Double check here.
        if (res.statusCode === 200) {
          let buff = Buffer.concat(chunks);
          const contentType: String = res.headers['content-type'] || '';
          const matchCharset = contentType.match(/(?:charset=)(\w+)/) || [];
          // 转编码，保持跟响应一致
          let body = iconv.decode(buff, matchCharset[1] || 'utf8');
          resolve(body);
        } else {
          reject('网络请求错误!');
        }
      });
      // res.on('end', () => resolve(chunks));
    });
  });
};

interface FundInfo {
  name: string // 名称
  todayOpen: string // 今日开盘价
  lastClose: string // 昨日收盘价
  nowPrice: string // 现价
  hightPrice: string // 今日最高价
  lowPrice: string // 今日最低价
  changeAmount: string // 今日涨跌幅
  code: string // 代码
  fullcode: string // 代码
}

// 根据基金代码请求基金数据
export default function fundApi(codes: string[]): Promise<FundInfo[]> {
 // 请求列表
  const promises: Promise<string>[] = codes.map((code) => {
    const url = `https://hq.sinajs.cn/list=${code}`;
    return request(url);
  });
  return Promise.all(promises).then((results) => {
    const resultArr: FundInfo[] = [];
    results.forEach((rsp: string) => {
      const itemArr = rsp.split('="')[1].split(',')
      const code = rsp.split('="')[0].split('hq_str_')[1]
      const changeAmount = (((parseFloat(itemArr[3])-parseFloat(itemArr[2]))/parseFloat(itemArr[2]))*100).toFixed(2)
      const info: FundInfo = {
        name: itemArr[0], // 名称
        todayOpen: itemArr[1], // 今日开盘价
        lastClose: itemArr[2], // 昨日收盘价
        nowPrice: itemArr[3], // 现价
        hightPrice: itemArr[4], // 今日最高价
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