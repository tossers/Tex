import {Product as Component} from '../components/Product';
import {inject, observer} from 'mobx-react';

@inject((stores, props) => {
    return {
        ...props,
        lastPrice: stores.productStore.lastPrice,                   //最新价格
        onWSReceiveOrder: stores.productStore.onWSReceiveOrder,
        setOnWSReceiveOrderFalse: function(){
            stores.productStore.setOnWSReceiveOrderFalse();
        },
        assets: stores.assetsStore.assets,
        getUserAssets: function(){
            stores.assetsStore.getUserAssets();
        },

        assetsId: stores.userStore.assetsId,
        getProduct: function (productCode: string) {
            stores.productStore.setCurrent(productCode);
        },
        product: stores.productStore.current,
        min:stores.productStore.min,
        orderBook:stores.productStore.orderBook,
        trade:stores.productStore.trade,
        entrust: async function (type: string, productId: string, price: number, quantity: number, lever: number) {
            return stores.entrustStore.entrust(type, productId, price, quantity, lever);
        },
        getEntrusts: async function (productId: string) {
            return stores.entrustStore.getEntrusts(productId);
        },
        entrusts: stores.entrustStore.entrusDataSource,
        delEntrust: async function(entrustId:number){
            return stores.entrustStore.delEntrust(entrustId);
        },

        subscribe:(productId:number, assetsId: number)=>{
            stores.productStore.subscribe(productId, assetsId);
        },
        unSubscribe:(productId:number)=>{
            return stores.productStore.unSubscribe(productId);
        },

        //1.持仓列表； 2.获取持仓列表； 3.平仓操作；
        positionsDataSource: stores.positionStore.positionsDataSource,
        getPositionList: function () {
            stores.positionStore.getPositionList();
        },
        deletePosition: function (id: number) {
            return stores.positionStore.deletePosition(id);
        },
    };
})

@observer
export class Product extends Component {

}