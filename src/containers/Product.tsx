import {Product as Component} from '../components/Product';
import {inject, observer} from 'mobx-react';
import {ws} from '../api/WebSocket'

@inject((stores, props) => {
    return {
        ...props,
        getProduct: function (productCode: string) {
            stores.productStore.setCurrent(productCode);
        },
        product: stores.productStore.current,
        entrust: async function (type: string, productId: string, price: number, quantity: number) {
            return stores.entrustStore.entrust(type, productId, price, quantity);
        },
        getEntrusts: async function (productId: string) {
            return stores.entrustStore.getEntrusts(productId);
        },
        entrusts: stores.entrustStore.list,
        delEntrust: async function(entrustId:number){
            return stores.entrustStore.delEntrust(entrustId);
        },

        subscribe:(productId:number)=>{
            stores.productStore.subscribe(productId);
        },
        unSubscribe:(productId:number)=>{
            stores.productStore.subscribe(productId);
        },
        transaction: stores.transactionStore.data,
        getTransactionData: function (data) {
            stores.transactionStore.getTransactionData(data)
        },
        sellData: stores.orderBookStore.sellData,
        buyData: stores.orderBookStore.buyData,
        getOrderBook: function (data) {
            stores.orderBookStore.getOrderBook(data)
        },
        charData: stores.chartStore.charData,
        getMinLine: function(data){
            stores.chartStore.getMinLine(data)
        },
        ws: ws,
    };
})

@observer
export class Product extends Component {

}