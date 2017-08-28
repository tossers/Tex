import {action, observable} from 'mobx';
import {getUserAssets} from '../api/Index';

interface AssetsModel {
    availableassets: number;
    frozenassets: number;
    id: number;
    status: number;
    uid: number;
}

export class User {
    @observable
    assets: AssetsModel = {
        availableassets: 0,
        frozenassets: 0,
        id: 0,
        status: 0,
        uid: 0,
    };

    @action
    async getUserAssets() {
        return getUserAssets().then((data: AssetsModel) => {
            this.assets = data;
        });
    }
}

export default new User();