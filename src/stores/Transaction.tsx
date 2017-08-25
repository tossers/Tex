import {action, observable} from 'mobx';

interface transactionData { key: number, price: number, quantity: number, time: string, direction: string }


export class Transaction {
    @observable
    data: transactionData[] = [];

    @action
    getTransactionData = (data) =>{
        let mData = this.data.slice(0)
        const {entrustType, price, quantity, time} = data
        mData.unshift({
            key: mData.length,
            price: price.toFixed(1),
            quantity: quantity.toFixed(1),
            time: new Date(time).toLocaleTimeString(),
            direction: entrustType,
        })
        this.data = mData
    }
}

export default new Transaction();