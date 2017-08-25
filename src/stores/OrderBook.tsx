import {action, observable} from 'mobx';


export class OrderBook {
    @observable
    sellData: {}[] = [];

    @observable
    buyData: {}[] = [];

    @action
    getOrderBook = (data) => {
        const {buy, sell} = data
        let buyData:any = []
        let sellData:any = []
        buy.forEach((obj, index) => {
            let {quantity, price} = JSON.parse(obj)
            buyData.push({
                key: 'buy'+index,
                price,
                size: quantity.toFixed(4),
                total: (quantity * price).toFixed(4),
            })
        })
        sell.forEach((obj, index) => {
            let {quantity, price} = JSON.parse(obj)
            sellData.push({
                key: 'sell'+index,
                price,
                size: quantity.toFixed(4),
                total: (quantity * price).toFixed(4),
            })
        })
        this.sellData = sellData
        this.buyData = buyData
    }
}

export default new OrderBook();