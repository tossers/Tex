import {EntrustTable, Props, EntrustTableModel} from './EntrustTable';
import {inject} from 'mobx-react';

export {EntrustTableModel};
export const EntrustTableC = inject((stores): Props => {
    return {
        dataSource: stores.entrustStore.entrusDataSource,
        total: stores.entrustStore.total,
        loading: stores.entrustStore.loading,
        height: stores.oddStore.inventoryHeight,
        productList: stores.productStore.list,
        onDeleteEntrust: async function(entrustId: number){
            return stores.entrustStore.delEntrust(entrustId);
        },
        updateEntrustList: function(){
            return stores.entrustStore.updateEntrustList();
        },
        getEntrustList: function (currentPage: number) {
            return stores.entrustStore.getEntrustList(currentPage);
        }
    };
})(EntrustTable);
