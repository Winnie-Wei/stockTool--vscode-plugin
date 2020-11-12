import { TreeItem } from 'vscode';
interface FundInfo {
    name: string // 名称
    fullcode: string // 代码
    code: string // 代码
    todayOpen: string // 今日开盘价
    lastClose: string // 昨日收盘价
    nowPrice: string // 现价
    hightPrice: string // 今日最高价
    lowPrice: string // 今日最低价
    changeAmount: string // 今日涨跌幅
  }
export default class FundItem extends TreeItem {
  info: FundInfo;

  constructor(info: FundInfo) {
    const icon = info.nowPrice >= info.todayOpen ? '📈' : '📉';

    // 加上 icon，更加直观的知道是涨还是跌
    super(`${icon}${info.name}   ${info.changeAmount}%`);

    let sliceName = info.name;
    if (sliceName.length > 8) {
      sliceName = `${sliceName.slice(0, 8)}...`;
    }
    const tips = [
      `代码: ${info.code}`,
      `名称: ${sliceName}`,
      `--------------------------`,
      `现价:    ${parseFloat(info.nowPrice).toFixed(2)}`,
      `涨跌额:     ${(parseFloat(info.nowPrice)-parseFloat(info.lastClose)).toFixed(2)}`,
      `今日开盘价:     ${parseFloat(info.todayOpen).toFixed(2)}`,
      `今日最高价:      ${parseFloat(info.hightPrice).toFixed(2)}`,
      `今日最低价:      ${parseFloat(info.lowPrice).toFixed(2)}`,
    ];

    this.info = info;
    // tooltip 鼠标悬停时，展示的内容
    this.tooltip = tips.join('\r\n');
  }
}