import {action, computed, observable} from 'mobx';
import {getProducts} from '../api/Index';
import { timeFormat } from 'd3-time-format';

export class Product {
    @observable id: number;
    @observable code: string;
    @observable name: string;
    @observable status: number;

}

interface OneOrder {
    price: number;
    quantity: number;
    total: number;
    type: string;
    key: string | number;
}

interface Orders {
    sellData: Array<OneOrder>;
    buyData: Array<OneOrder>;
}

interface MTrade {
    price: number;
    quantity: number;
    time: string;
    entrustType: string;
}

interface OrderBook {
    sell: Array<OneOrder>;
    buy: Array<OneOrder>;
}

interface Trade {
    entrustType: string;
    price: number;
    quantity: number;
    time: string;
}

interface MinModel {
    price: number;
}

export class ProductList {
    @observable list: Product[] = [];

    @observable currentProductCode: string = '';

    @observable orderBook: Orders = {sellData: [], buyData: []};

    @observable min: string[] = [];

    @observable trade: MTrade[] = [];

    @observable onWSReceiveOrder: boolean = false;

    @observable lastPrice: number = 0;                      //分钟线的最新的价格

    onRecFirstMin = true;                                   //收到第一条分钟线的标志

    isOnMessage: boolean = false;

    ws;

    @action
    loadProducts() {
        getProducts().then((list) => {
            this.list = list.map((item) => {
                return Object.assign(item, {min: [], orderBook: [], trade: []});
            });
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

    @action
    subscribe(productId: number, assetsId: number) {
        const subCmd = JSON.stringify({
            'op': 'subscribe',
            args: [`orderBook:${productId}`, `trade:${productId}`, `min:${productId}`, 'order']
        });

        if (!this.ws) {
            const webSocketUrl: string = `ws://tex.tuling.me:8089/websocket?${assetsId}`;
            this.ws = new WebSocket(webSocketUrl);
            this.ws.onopen = () => {
                this.ws.send(subCmd);
            };
        } else {
            this.ws.send(subCmd);
        }

        if (!this.isOnMessage) {
            this.ws.onmessage = (evt) => {
                // console.log('receipt', JSON.parse(evt.data));
                [].concat(JSON.parse(evt.data)).forEach(this.deal.bind(this));
            };
            this.isOnMessage = true;
        }
    }

    @action
    unSubscribe(productId: number) {
        if (this.ws) {
            this.ws.send(JSON.stringify({
                'op': 'unsubscribe',
                args: [`orderBook:${productId}`, `trade:${productId}`, `min:${productId}`, 'order']
            }));
        }
        this.onRecFirstMin = true;                                      //重新获取第一条分钟线的最新价格
        this.min.splice(0, this.min.length);
        this.trade.splice(0, this.trade.length);
        this.orderBook.sellData.splice(0, this.orderBook.sellData.length);
        this.orderBook.buyData.splice(0, this.orderBook.sellData.length);
    }

    handleOrderBook(data: OrderBook) {
        const {buy, sell} = data;
        const deal = (type) => {
            return (item, index) => {
                let jsonItem = JSON.parse(item);
                const mPrice = parseFloat((jsonItem.price).toFixed(4));
                const mQuantity = parseFloat((jsonItem.quantity).toFixed(4));
                let total = parseFloat((mPrice * mQuantity).toFixed(4));
                return ({key: type + index, type, price: mPrice, quantity: mQuantity, total});
            };
        };
        const mSort = (a, b) => (b.price - a.price);
        let buyData = buy.map(deal('buy')).sort(mSort);
        let sellData = sell.map(deal('sell')).sort(mSort);
        this.orderBook = {sellData, buyData};
    }

    @computed
    get tradeDataSource(){
        return this.trade.map((item, index) => {
            let {entrustType, price, quantity, time} = item;
            return ({
                key: index,
                price,
                quantity,
                time: timeFormat('%H:%M:%S')(new Date(time)),
                direction: entrustType,
            });
        });
    }

    handleTrade(data: Trade[]) {
        data.forEach((item) => {
            this.trade.unshift(item);
        });
        this.trade = this.trade.slice(0, 100);
    }

    deal(msg: { cmd: string; data: MinModel[] | Trade | Trade[] | OrderBook | OrderBook[] }): void {
        switch (msg.cmd) {
            case 'orderBook':
                const temp: OrderBook[] = (([] as OrderBook[]).concat(msg.data as OrderBook));
                temp.forEach((item) => {
                    this.handleOrderBook(item);
                });
                break;
            case 'trade':
                const tradeTemp: Trade[] = (([] as Trade[]).concat(msg.data as Trade));
                this.handleTrade(tradeTemp);
                break;
            case 'order':
                this.onWSReceiveOrder = true;
                break;
            case 'min':
                // console.log('min', msg.data);
                const minTemp: MinModel[] = (([] as MinModel[]).concat(msg.data as MinModel));
                if( this.onRecFirstMin && minTemp.length > 0){
                    this.onRecFirstMin = false;
                    this.lastPrice = minTemp[minTemp.length - 1].price;
                }
                break;
            default:
                break;
        }
    }

    @action
    setOnWSReceiveOrderFalse(){
        this.onWSReceiveOrder = false;
    }
}

export default new ProductList();