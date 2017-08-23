import {action, computed, observable} from 'mobx';
import {getProducts} from '../api/Index';

export class Product {
    @observable id: number;
    @observable code: string;
    @observable name: string;
    @observable status: number;
}

export class ProductList {
    @observable list: Product[] = [];

    @observable currentProductCode: string = '';

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