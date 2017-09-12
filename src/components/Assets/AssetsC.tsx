import {Assets, Props, AssetsModel} from './Assets';
import {inject} from 'mobx-react';
export {AssetsModel};
export const AssetsC = inject((stores): Props => {
    return {
        assets: stores.assetsStore.assets,
        getUserAssets: () => stores.assetsStore.getUserAssets(),
    };
})(Assets);