"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const Provider_1 = require("./Provider");
// 激活插件
function activate(context) {
    // 获取 interval 配置
    let interval = vscode_1.workspace.getConfiguration().get('fund-watch.interval', 2);
    if (interval < 2) {
        interval = 2;
    }
    // 基金类
    const provider = new Provider_1.default();
    // 数据注册
    vscode_1.window.registerTreeDataProvider('stock-list', provider);
    // 定时更新
    setInterval(() => {
        provider.refresh();
    }, interval * 1000);
    // 事件
    context.subscriptions.push(vscode_1.commands.registerCommand('fund.refresh', () => {
        provider.refresh();
    }), vscode_1.commands.registerCommand('fund.add', () => {
        provider.addFund();
    }), vscode_1.commands.registerCommand('fund.item.remove', (fund) => {
        const { fullcode } = fund;
        provider.removeConfig(fullcode);
        provider.refresh();
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map