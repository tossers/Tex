import {Assets, Props, AssetsModel} from './Assets';
import {inject} from 'mobx-react';
export {AssetsModel};
export const AssetsC = inject((stores): Props => {
    return {
        underUrl: stores.userStore.underUrl,
        topUrl: stores.userStore.topUrl,
        name: stores.userStore.name,
        identityId: stores.userStore.identityId,
        checkStatus: stores.userStore.checkStatus,
        assets: stores.assetsStore.assets,
        getUserAssets: () => stores.assetsStore.getUserAssets(),
        identityCheck: (identityId: string, name: string, topper: string, under: string) => stores.userStore.identityCheck(identityId, name, topper, under),
        identityCheckStatus: () => stores.userStore.identityCheckStatus(),
    };
})(Assets);