import {action, computed, observable} from 'mobx';
import {getProducts} from '../api/Index';
import { timeFormat } from 'd3-time-format';
import {MyWebSocket} from '../api/MyWebSocket';
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

    tradeBuffer: MTrade[] = [];

    orderBookBuffer: Orders = {sellData: [], buyData: []};

    timer;

    start;

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
            this.ws = new MyWebSocket().getInstance(assetsId, subCmd);
        } else {
            this.ws.send(subCmd);
        }

        if (!this.isOnMessage) {
            this.ws.onmessage = (evt) => {
                // wsReconnect.reset();
                // console.log('receipt', JSON.parse(evt.data));
                [].concat(JSON.parse(evt.data)).forEach(this.deal.bind(this));
                this.throttle(500, 2500);
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
                // let jsonItem = JSON.parse(item);
                const mPrice = item.price;
                const mQuantity = item.quantity;
                let total = mPrice * mQuantity;
                return ({key: type + index, type, price: mPrice, quantity: mQuantity, total});
            };
        };
        const mSort = (a, b) => (b.price - a.price);
        let buyData = buy.map(deal('buy')).sort(mSort);
        let sellData = sell.map(deal('sell')).sort(mSort);
        this.orderBookBuffer = {sellData, buyData};
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
            this.tradeBuffer.unshift(item);
        });
        this.tradeBuffer = this.tradeBuffer.splice(0, 100);
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

    throttle(delay: number, applyTime: number){
        if (this.timer) {
            clearTimeout(this.timer);
        }

        let cur = Date.now();                   //记录当前时间

        if (!this.start) {                      //若该函数是第一次调用，则直接设置_start,即开始时间，为_cur，即此刻的时间
            this.start = cur;
        }

        if (cur - this.start > applyTime) {
            //当前时间与上一次函数被执行的时间作差，与mustApplyTime比较，若大于，则必须执行一次函数，若小于，则重新设置计时器
            this.orderBook = this.orderBookBuffer;
            this.trade = this.tradeBuffer;
            this.start = cur;
        } else {
            this.timer = setTimeout(() => {
                this.orderBook = this.orderBookBuffer;
                this.trade = this.tradeBuffer;
            }, delay);
        }
    }
}

export default new ProductList();