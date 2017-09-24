import {entrust, entrusts, delEntrust, stopOrder} from '../api/Index';
import {action, computed, observable} from 'mobx';
import {priceCalibration, positionCalibration} from '../config';

//委托单
interface EntrustModel {
    action: number;           //订单类型----> 1 下单 2 撤单 -1 平仓(非必传)
    assetsId: number;	      //用户资金账户(非必传)
    bond:	number;           //下单保证金 可不传
    createdAt: number;        //订单时间（非必传）
    id: number;               //委托单ID
    lever: number;	          //杠杆倍数（必传，且倍数必须为大于1的整数）
    modifiedAt: number;       //最后修正时间,默认创建时间
    orderId: string;          //订单id md5(用户资金id+时间戳+产品id) 16位
    price: number;            //委托价格（必传，且价格必须大于0）
    productId: number;        //产品id
    quantity: number;         //数量
    residue: number;          //剩余仓位 如果剩余仓位为0,表示该订单已完全成交
    type: number;             //订单方向（必传）----> BUY,SELL,SHORT,COVER分别用1,2,3,4表示
    stopProfit: number;       //止盈价
    stopLoss: number;         //止损价
}

class Entrust {

    @observable list: EntrustModel[] = [];   //委托列表
    @observable currentPage: number = 1;
    @observable total: number = 0;
    @observable loading: boolean = false;

    /**
     * 刷新委托列表
     */
    @action
    updateEntrustList(){
        this.getEntrustList(this.currentPage);
    }

    /**
     * 下单操作
     * @param type
     * @param productId
     * @param price
     * @param quantity
     * @param lever
     * @returns {Promise<Promise<TResult|TResult2|TResult1>>}
     */
    @action
    async entrust(type: string, productId: string, price: number, quantity: number, lever: number) {
        return entrust(type, productId, price, quantity, lever);
    }

    /**
     * 获取委托列表
     * @param productId
     * @returns {Promise<TResult2|TResult1>}
     */
    @action
    getEntrustList(currPage: number) {
        this.loading = true;
        entrusts(currPage).then((data)=>{
            this.list = data.list;
            this.total = data.total;
            this.currentPage = data.currentPage;
            this.loading = false;
        });
    }

    /**
     * 撤单操作
     * @param entrustId
     * @returns {Promise<Promise<TResult|AxiosResponse>>}
     */
    @action
    async delEntrust(entrustId:number){
        return delEntrust(entrustId);
    }

    /**
     * 设置止盈止损
     * @param {number} productId
     * @param {number} stopLoss
     * @param {number} stopProfit
     * @returns {Promise<Promise<AxiosResponse>>}
     */
    @action
    async stopOrder(productId: number, stopLoss: number, stopProfit: number){
        return stopOrder(productId, stopLoss, stopProfit);
    }

    /**
     * 为数据添加key属性，组件Table需要唯一key
     * @returns {[(EntrustItems&{key: number}),(EntrustItems&{key: number}),(EntrustItems&{key: number}),(EntrustItems&{key: number}),(EntrustItems&{key: number})]}
     */
    @computed
    get entrusDataSource(){
        return this.list.map((item, index: number) => {
            item.price = item.price / priceCalibration;
            item.stopLoss = item.stopLoss / priceCalibration;
            item.stopProfit = item.stopProfit / priceCalibration;
            item.bond = item.bond / priceCalibration;
            item.quantity = item.quantity / positionCalibration;
            item.residue = item.residue / positionCalibration;
            return Object.assign(item, {key: index});
        });
    }

}

export default new Entrust();