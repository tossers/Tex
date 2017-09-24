import {RechargeModal, Props} from './RechargeModal';
import {inject} from 'mobx-react';

export const RechargeModalC = inject((stores): Props => {
    return {
        recharge: async (money: number) => stores.userStore.recharge(money),
        getUserAssets: () => stores.assetsStore.getUserAssets(),
    };
})(RechargeModal);