import {OrderBook, Props, OrderBookTableModel} from './OrderBook';
import {inject} from 'mobx-react';
export {OrderBookTableModel};
export const OrderBookC = inject((stores): Props => {
    return {
        height: stores.oddStore.orderBookHeight,
        sellData: stores.wsStore.orderBookDataSource.sellData,
        buyData: stores.wsStore.orderBookDataSource.buyData,
    };
})(OrderBook);