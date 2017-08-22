import {entrust} from '../api/Index';
import {action, observable} from 'mobx';

class Entrust {

    @observable
    lists: string[] = [];

    @action
    async entrust(type: string, productId: string, price: number, quantity: number) {
        return entrust(type, productId, price, quantity);
    }

}

export default new Entrust();