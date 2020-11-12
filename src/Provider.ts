import { workspace, TreeDataProvider, Event, EventEmitter, window } from 'vscode'
import fundApi from './api'
import FundItem from './TreeItem'
interface FundInfo {
    name: string // 名称
    code: string // 代码
    fullcode: string // 代码
    todayOpen: string // 今日开盘价
    lastClose: string // 昨日收盘价
    nowPrice: string // 现价
    hightPrice: string // 今日最高价
    lowPrice: string // 今日最低价
    changeAmount: string // 今日涨跌幅
  }
export default class DataProvider implements TreeDataProvider<FundInfo> {
    private refreshEvent: EventEmitter<FundInfo | null> = new EventEmitter<FundInfo | null>()
    readonly onDidChangeTreeData: Event<FundInfo | null> = this.refreshEvent.event
    // 更新配置
    updateConfig(funds: string[]) {
        const config = workspace.getConfiguration();
        const favorites = Array.from(
        new Set([
                ...config.get('fund-watch.favorites', []),
                ...funds,
            ])
        );
        config.update('fund-watch.favorites', favorites, true);
    }
    async addFund() {
        // 弹出输入框
        const res = await window.showInputBox({
          value: '',
          valueSelection: [5, -1],
          prompt: '添加我的票票',
          placeHolder: 'Add Fund To Favorite',
          validateInput: (inputCode: string) => {
            const codeArray = inputCode.split(/[\W]/);
            const hasError = codeArray.some((code) => {
              // return code !== '' && !/^\d+$/.test(code);
              return !(code.startsWith('sh') || code.startsWith('sz'))
            });
            return hasError ? '股票代码输入有误' : null;
          },
        });
        if (!!res) {
          const codeArray = res.split(/[\W]/) || [];
          const result = await fundApi([...codeArray]);
          if (result && result.length > 0) {
            // 只更新能正常请求的代码
            const codes = result.map(i => i.fullcode);
            this.updateConfig(codes);
            this.refresh();
          } else {
            window.showWarningMessage('stocks not found');
          }
        }
    }

    // 删除配置
    removeConfig(code: string) {
        const config = workspace.getConfiguration()
        const favorites: string[] = [...config.get('fund-watch.favorites', [])]
        const index = favorites.indexOf(code)
        if (index === -1) return 
        favorites.splice(index, 1)
        config.update('fund-watch.favorites', favorites, true)
    }

    refresh() {
      // 更新视图
      setTimeout(() => {
        this.refreshEvent.fire(null)
      }, 200)
    }

    getTreeItem(info: FundInfo): FundItem {
        return new FundItem(info)
    }

    getChildren(): Promise<FundInfo[]> {
        // 获取配置的基金代码
        const favorites: string[] = workspace
        .getConfiguration()
        .get('fund-watch.favorites', [])
        
        // 获取基金数据
    return fundApi([...favorites]).then(
        (results: FundInfo[]) => results
        // .sort(
        //     (prev, next) => (prev.changeAmount >= next.changeAmount ? 1 : -1)
        //     )
        );
    }
}