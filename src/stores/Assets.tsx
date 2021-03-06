import {action, observable} from 'mobx';
import {getUserAssets} from '../api/Index';
import {AssetsModel} from '../components/Assets/Assets';
import {priceCalibration, positionCalibration} from '../config';

export class Assets {
    //资金账户
    @observable
    assets: AssetsModel = {
        uid: 0,                  //用户id
        id: 0,                   //资金账户id
        available: 0,            //可用资金
        margin: 0,               //成交保证金
        trust: 0                 //委托保证金
    };

    /**
     * 获取资金账户
     * @returns {Promise<TResult2|TResult1>}
     */
    @action
    getUserAssets() {
        getUserAssets().then((data: AssetsModel) => {
            data.available = data.available / (priceCalibration * positionCalibration);
            data.margin = data.margin / (priceCalibration * positionCalibration);
            data.trust = data.trust / (priceCalibration * positionCalibration);
            this.assets = data;
        });
    }
}

export default new Assets();