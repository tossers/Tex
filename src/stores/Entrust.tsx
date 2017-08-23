import {entrust, entrusts} from '../api/Index';
import {action, observable} from 'mobx';

interface EntrustItems {
    id: string;
    price: number;
    quantity: number;
}

class Entrust {

    @observable
    list: EntrustItems[] = [];

    @action
    async entrust(type: string, productId: string, price: number, quantity: number) {
        return entrust(type, productId, price, quantity);
    }

    @action
    async getEntrusts(productId: string) {
        return entrusts(Number(productId)).then((list)=>{
            this.list = list;
        });
    }

}

export default new Entrust();