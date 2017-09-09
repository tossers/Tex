import {action, computed, observable} from 'mobx';
import {deletePosition, getPositionList} from '../api/Index';

//持仓
interface PositionModel{
    id: number;               //id
    productId: number;        //产品id
    name: string;             //产品名字
    position: number;         //仓位
    bond: number;             //成本
    avgPrice: number;         //均价
}

export class APosition {
    @observable list: PositionModel[] = [];     //持仓列表

    /**
     * 获取持仓列表
     * @returns {Promise<TResult2|TResult1>}
     */
    @action
    async getPositionList() {
        return getPositionList().then((data)  => {
            this.list = data;
        });
    }

    /**
     * 平仓并刷新持仓列表
     * @param id
     * @returns {Promise<TResult2|TResult1>}
     */
    @action
    async deletePosition(id: number) {
        return deletePosition(id);
    }

    /**
     * 为数据添加key属性，组件Table需要唯一key
     * @returns {[(PositionModel&{key: number}),(PositionModel&{key: number}),(PositionModel&{key: number}),(PositionModel&{key: number}),(PositionModel&{key: number})]}
     */
    @computed
    get positionsDataSource() {
        return this.list.map((item, index: number) => {
            return Object.assign(item, {key: index});
        });
    }
}

export default new APosition();