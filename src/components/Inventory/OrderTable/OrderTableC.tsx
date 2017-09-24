import {OrderTable, Props, OrderTableModel} from './OrderTable';
import {inject} from 'mobx-react';

export {OrderTableModel};

export const OrderTableC = inject((stores): Props => {
    return {
        dataSource: stores.dealOrderStore.list,                     //成交单
        total: stores.dealOrderStore.total,
        loading: stores.dealOrderStore.loading,
        height: stores.oddStore.inventoryHeight,
        getDealOrders: async function(page: number){
            return stores.dealOrderStore.getDealOrders(page);
        }
    };
})(OrderTable);
