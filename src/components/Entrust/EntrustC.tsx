import {Entrust, Props} from './Entrust';
import {inject} from 'mobx-react';

export const EntrustC = inject((stores): Props => {
    return {
        availableassets: stores.assetsStore.assets.available,
        lastPrice: stores.wsStore.lastPrice,
        updateEntrustList: stores.entrustStore.updateEntrustList,
        getUserAssets: stores.assetsStore.getUserAssets,
        product: stores.productStore.current,
        entrust: async (type: string, productId: string, price: number, quantity: number, lever: number) => {
            return stores.entrustStore.entrust(type, productId, price, quantity, lever);
        }
    };
})(Entrust);