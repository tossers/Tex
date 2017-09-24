import {action, observable} from 'mobx';
import {getDealOrders} from '../api/Index';
import {OrderTableModel} from '../components/Inventory/Inventory';
import {priceCalibration, positionCalibration} from '../config';

export class DealOrder {
    @observable list: OrderTableModel[] = [];     //成交单
    @observable total: number = 0;
    @observable currentPage: number = 1;
    @observable loading: boolean = false;

    /**
     * 获取成交单
     * @returns {Promise<TResult2|TResult1>}
     */
    @action
    getDealOrders(page: number) {
        this.loading = true;
        getDealOrders(page).then((data)  => {
            this.list = data.list.map((item, index: number) => {
                item.price = item.price / priceCalibration;
                item.quantity = item.quantity / positionCalibration;
                return Object.assign(item, {key: index});
            });
            this.total = data.total;
            this.currentPage = data.currPage;
            this.loading = false;
        });
    }

    /**
     * 刷新成交单
     */
    @action
    updateDealOrders(){
        this.getDealOrders(this.currentPage);
    }

    // /**
    //  * 为数据添加key属性，组件Table需要唯一key
    //  * @returns {[(EntrustItems&{key: number}),(EntrustItems&{key: number}),(EntrustItems&{key: number}),(EntrustItems&{key: number}),(EntrustItems&{key: number})]}
    //  */
    // @computed
    // get dealOrderDataSource(){
    //     return this.list.map((item, index: number) => {
    //         return Object.assign(item, {key: index});
    //     });
    // }
}

export default new DealOrder();