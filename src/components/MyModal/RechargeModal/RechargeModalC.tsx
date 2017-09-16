import {RechargeModal, Props} from './RechargeModal';
import {inject} from 'mobx-react';

export const RechargeModalC = inject((stores): Props => {
    return {
        url: stores.userStore.url,
        recharge: (money: number) => stores.userStore.recharge(money),
        getUserAssets: () => stores.assetsStore.getUserAssets(),
    };
})(RechargeModal);