import {action, computed, observable} from 'mobx';
import {getProducts} from '../api/Index';

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
    key: [string, number];
}

interface Orders {
    sellData: Array<OneOrder>;
    buyData: Array<OneOrder>;
}

interface MTrade {
    price: number;
    quantity: number;
    time: string;
    key: number;
    direction: string;
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

export class ProductList {
    @observable list: Product[] = [];

    @observable currentProductCode: string = '';

    @observable orderBook: Orders = {sellData: [], buyData: []};

    @observable min: string[] = [];

    @observable trade: MTrade[] = [];

    @observable onWSReceiveOrder: boolean = false;

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
            args: [`orderBook:${productId}`, `trade:${productId}`, 'order']
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
                console.log('receipt', JSON.parse(evt.data));
                [].concat(JSON.parse(evt.data)).forEach(this.deal.bind(this));
            };
            this.isOnMessage = true;
        }
    }

    @action
    unSubscribe(productId: number) {
        if (this.ws) {
            console.log('unSubscribe')
            this.ws.send(JSON.stringify({
                'op': 'unsubscribe',
                args: [`orderBook:${productId}`, `trade:${productId}`, `min:${productId}`, 'order']
            }));
        }
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
        let buyData = buy.map(deal('buy'));
        let sellData = sell.map(deal('sell'));
        this.orderBook = {
            sellData: sellData.sort(mSort).splice(sellData.length-4, sellData.length-1),
            buyData: buyData.sort(mSort).splice(0, 4)
        };
    }

    handleTrade(data: Trade[]) {
        let trade = this.trade.slice(0);
        data.forEach((item) => {
            let {entrustType, price, quantity, time} = item;
            trade.unshift({
                key: trade.length,
                price: parseFloat(price.toFixed(4)),
                quantity: parseFloat(quantity.toFixed(4)),
                time: new Date(time).toLocaleTimeString(),
                direction: entrustType,
            });
        });
        this.trade = trade.slice(0, 100);
    }

    deal(msg: { cmd: string; data: Trade | Trade[] | OrderBook | OrderBook[] }): void {
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
                console.log('order', msg.data);
                this.onWSReceiveOrder = true;
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