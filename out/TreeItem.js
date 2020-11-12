"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class FundItem extends vscode_1.TreeItem {
    constructor(info) {
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
            `涨跌额:     ${(parseFloat(info.nowPrice) - parseFloat(info.lastClose)).toFixed(2)}`,
            `今日开盘价:     ${parseFloat(info.todayOpen).toFixed(2)}`,
            `今日最高价:      ${parseFloat(info.hightPrice).toFixed(2)}`,
            `今日最低价:      ${parseFloat(info.lowPrice).toFixed(2)}`,
        ];
        this.info = info;
        // tooltip 鼠标悬停时，展示的内容
        this.tooltip = tips.join('\r\n');
    }
}
exports.default = FundItem;
//# sourceMappingURL=TreeItem.js.map