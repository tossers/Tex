import {Product as Component} from '../components/Product';
import {inject, observer} from 'mobx-react';

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
        }
    };
})
@observer
export class Product extends Component {
}