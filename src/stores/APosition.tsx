import {action, computed, observable} from 'mobx';
import {deletePosition, getPositionList} from '../api/Index';
//持仓
interface PositionModel{
    averagePrice: number;  //均价
    cost: number;          //成本
    id: number;            //持仓id
    position: number;      //持仓数量
    productId: number;     //产品id
    status: number;        //持仓状态，1为可用
    userAssetsId: number;  //用户资金id
}

export class APosition {

    @observable list: PositionModel[] = [];

    //获取持仓列表
    @action
    async getPositionList() {
        return getPositionList().then((data)  => {
            this.list = data;
        });
    }

    //平仓并刷新持仓列表
    @action
    async deletePosition(id: number) {
        return deletePosition(id).then(() => {
            this.getPositionList();
        });
    }

    @computed
    get positionsDataSource() {
        return this.list.map((item, index: number) => {
            //为数据添加key属性，组件Table需要唯一key
            return Object.assign(item, {key: index});
        });
    }
}

export default new APosition();