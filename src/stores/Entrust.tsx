import {entrust, entrusts, delEntrust} from '../api/Index';
import {toFixed} from '../utils';
import {action, computed, observable} from 'mobx';

//委托单
interface EntrustItems {
    stopLoss: number;      //止损价格
    stopProfit: number;    //止盈价格
    orderType: number;     //订单方向----> BUY,SELL,SHORT,COVER分别用1,2,3,4表示
    userAssetsId: number;  //用户资金id
    price: number;         //委托价格
    productId: number;     //产品id
    lever: number;         //杠杆倍数
    quantity: number;      //数量
    orderMethod: number;   //订单类型----> 1 下单 2 撤单 3 平仓(非必传)
    turnover: number;      //成交额
    id: number;            //订单id
    status: number;        //订单状态，1为可用
    createdTime: string;   //订单时间
}

class Entrust {

    @observable
    list: EntrustItems[] = [];

    @action
    async entrust(type: string, productId: string, price: number, quantity: number, lever: number) {
        return entrust(type, productId, price, quantity, lever);
    }

    @action
    async getEntrusts(productId: string) {
        return entrusts(Number(productId)).then((list)=>{
            this.list = list;
        });
    }

    @action
    async delEntrust(entrustId:number){
        return delEntrust(entrustId);
    }

    @computed
    get entrusDataSource(){
        return this.list.map((item, index: number) => {
            //为数据添加key属性，组件Table需要唯一key
            let obj = toFixed(item as {});
            return Object.assign(obj, {key: index});
        });
    }

}

export default new Entrust();