// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ExtensionContext, commands, window, workspace } from 'vscode';
import Provider from './Provider';

// 激活插件
export function activate(context: ExtensionContext) {
	// 获取 interval 配置
	let interval = workspace.getConfiguration().get('fund-watch.interval', 2)
	if (interval < 2) {
	  interval = 2
	}
	// 基金类
	const provider = new Provider();

	// 数据注册
	window.registerTreeDataProvider('stock-list', provider);

	// 定时更新
	setInterval(() => {
		provider.refresh()
	}, interval * 1000)

	// 事件
	context.subscriptions.push(
		commands.registerCommand('fund.refresh', () => {
			provider.refresh();
		}),
		commands.registerCommand('fund.add', () => {
			provider.addFund();
		}),
		commands.registerCommand('fund.item.remove', (fund) => {
			const { fullcode } = fund;
			provider.removeConfig(fullcode);
			provider.refresh();
		})
	);
}

export function deactivate() {}
