import {Transaction, Props, RecentTradeTableModel} from './Transaction';
import {inject} from 'mobx-react';
export {RecentTradeTableModel};
export const TransactionC = inject((stores): Props => {
    return {
        height: stores.oddStore.transactionHeight,
        dataSource: stores.wsStore.tradeDataSource,
    };
})(Transaction);