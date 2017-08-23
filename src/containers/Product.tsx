import {Product as Component} from '../components/Product';
import {inject, observer} from 'mobx-react';

@inject((stores,props)=>{
    return {
        ...props,
        getProduct:function(productCode:string){
            stores.productStore.setCurrent(productCode);
        },
        product:stores.productStore.current,
        entrust:async function(type:string,productId:string,price:number,quantity:number){
            return stores.entrustStore.entrust(type,productId,price,quantity);
        }
    };
})
@observer
export class Product extends Component {
}