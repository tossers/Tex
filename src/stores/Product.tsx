import {action, computed, observable} from 'mobx';
import {getProducts} from '../api/Index';
import {wsSubscribe,wsUnsubscribe} from '../api/WebSocket'

export class Product {
    @observable id: number;
    @observable code: string;
    @observable name: string;
    @observable status: number;
}

export class ProductList {
    @observable list: Product[] = [];

    @observable currentProductCode: string = '';

    @observable line:{time:number,close:number,volume:number}[] = [];


    @action
    loadProducts() {
        getProducts().then((list) => {
            this.list = list;
        });
    }

    @action
    setCurrent(productCode: string) {
        this.currentProductCode = productCode;
    }

    @action subscribe(productId:number){
        if(productId){
            wsSubscribe(productId)

        }
    }

    @action unSubscribe(productId:number){
        if(productId){
            wsUnsubscribe(productId);

        }
    }

    @computed
    get current() {
        const temp = this.list.filter((product) => product.code === this.currentProductCode);
        if (!!temp.length) {
            return temp[0];
        }
        return {};
    }

}

export default new ProductList();