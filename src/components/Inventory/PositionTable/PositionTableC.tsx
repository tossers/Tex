import {PositionTable, Props, PositionTableModel} from './PositionTable';
import {inject} from 'mobx-react';

export {PositionTableModel};
export const PositionTableC = inject((stores): Props => {
    return {
        loading: stores.positionStore.loading,
        availableAssets: stores.assetsStore.assets.available,
        dataSource: stores.positionStore.positionsDataSource,          //成交单
        height: stores.oddStore.inventoryHeight,
        getPositionList: function () {
            return stores.positionStore.getPositionList();
        },
        deletePosition: async function (entrustId: number) {
            return stores.positionStore.deletePosition(entrustId);
        },
        getUserAssets: function () {
            return stores.assetsStore.getUserAssets();
        },
        updateEntrustList: function () {
            return stores.entrustStore.updateEntrustList();
        }
    };
})(PositionTable);
