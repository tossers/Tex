import {entrust, entrusts,delEntrust} from '../api/Index';
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

}

export default new Entrust();