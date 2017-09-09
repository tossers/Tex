import {action, computed, observable} from 'mobx';
import {getDealOrders} from '../api/Index';
import {OrderTableModel} from '../components/Inventory/index';

export class DealOrder {
    @observable list: OrderTableModel[] = [];     //成交单
    @observable total: number = 0;
    /**
     * 获取成交单
     * @returns {Promise<TResult2|TResult1>}
     */
    @action
    async getDealOrders(page: number, size: number) {
        return getDealOrders(page, size).then((data)  => {
            this.list = data.list;
            this.total = data.total;
        });
    }

    @computed
    get dealOrderDataSource() {
        return this.list.map((item, index: number) => {
            return Object.assign(item, {key: index});
        });
    }
}

export default new DealOrder();