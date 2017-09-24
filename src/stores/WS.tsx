import {action, computed, observable} from 'mobx';
import {MyWebSocket} from '../api/MyWebSocket';
import {OrderBookTableModel} from '../components/OrderBook/OrderBookC';
import {sortBy} from '../util/index';
import {Throttle} from '../util/Throttle';

interface OrderBookModel {
    sell: OrderBookTableModel[];
    buy: OrderBookTableModel[];
}

interface TradeModel {
    cancel: boolean;
    type: number;     //1 'BUY' or -1 'SELL'
    fromID: string;
    id: number;
    price: number;
    product: string;
    quantity: number;
    time: number;
    toID: string;
}

interface MinModel{
    price: number;
}

export class WS {
    @observable orderBook: OrderBookModel = {sell: [], buy: []};          //盘口信息
    @observable trade: TradeModel[] = [];                                 //最近交易
    @observable onWSReceiveOrder: boolean = false;                         //WS接收到order的标志
    @observable lastPrice: number = 0;                                    //分钟线的最新的价格
    tradeBuffer: TradeModel[] = [];                                       //接收数据的节流buffer
    orderBookBuffer: OrderBookModel = {sell: [], buy: []};                //接收数据的节流buffer
    ws;                                                                   //webSocket对象
    isOnMessage: boolean = false;                                         //WSonMessage's lock
    productId: number;
    throttle = new Throttle(500, 2500, () => {
        this.orderBook = this.orderBookBuffer;
        this.trade = this.tradeBuffer;
        this.onWSReceiveOrder = false;
    });

    /**
     * WS订阅
     * @param productId
     * @param assetsId
     */
    @action
    subscribe(productId: number, assetsId: number) {
        this.productId = productId;
        const subCmd = JSON.stringify({
            'op': 'subscribe',
            args: [`orderBook:${productId}`, `trade:${productId}`, `min:${productId}`, 'order']
        });

        if (!this.ws || this.ws.readyState === 2 || this.ws.readyState === 3) {
            this.ws = new MyWebSocket().getInstance(assetsId, subCmd);
        } else {
            this.ws.send(subCmd);
        }

        if (!this.isOnMessage) {
            this.ws.onmessage = (evt) => {
                [].concat(JSON.parse(evt.data)).forEach(this.deal.bind(this));
            };
            this.isOnMessage = true;
        }
    }

    /**
     * WS取消订阅，清空数据
     * @param productId
     */
    @action
    unSubscribe(productId: number) {
        if (this.ws && this.ws.readyState === 1) {
            this.ws.send(JSON.stringify({
                'op': 'unsubscribe',
                args: [`orderBook:${productId}`, `trade:${productId}`, `min:${productId}`, 'order']
            }));
        }
        this.tradeBuffer.splice(0, this.tradeBuffer.length);
        this.trade.splice(0, this.trade.length);
        this.orderBookBuffer.sell.splice(0, this.orderBookBuffer.sell.length);
        this.orderBookBuffer.buy.splice(0, this.orderBookBuffer.sell.length);
        this.orderBook.sell.splice(0, this.orderBook.sell.length);
        this.orderBook.buy.splice(0, this.orderBook.sell.length);
    }

    /**
     * 处理WS数据
     * @param msg
     */
    deal(msg: { cmd: string; data: MinModel[] | TradeModel | TradeModel[] | OrderBookModel | OrderBookModel[] }): void {
        switch (msg.cmd) {
            case 'orderBook':
                const orderBookTemp: OrderBookModel[] = (([] as OrderBookModel[]).concat(msg.data as OrderBookModel));
                orderBookTemp.forEach((item) => {
                    const {buy, sell} = item;
                    this.orderBookBuffer = {sell, buy};
                });
                break;
            case 'trade':
                const tradeTemp: TradeModel[] = (([] as TradeModel[]).concat(msg.data as TradeModel));
                tradeTemp.forEach((item) => {
                    this.tradeBuffer.unshift(item);
                });
                this.tradeBuffer = this.tradeBuffer.splice(0, 100).sort(sortBy('time'));
                break;
            case 'order':
                this.onWSReceiveOrder = true;
                break;
            case 'min':
                if(this.ws){
                    const minTemp: MinModel[] = (([] as MinModel[]).concat(msg.data as MinModel));
                    this.ws.send(JSON.stringify({'op': 'unsubscribe', args: [ `min:${this.productId}`]}));
                    this.lastPrice = minTemp.length>0? minTemp[minTemp.length - 1].price: 0;
                }
                break;
            default:
                break;
        }
        this.throttle.run();
        // this.throttle(500, 2500);
    }

    /**
     * 获取盘口信息组件Table的DataSource
     * @returns {{sellData: OrderModel[], buyData: OrderModel[]}}
     */
    @computed
    get orderBookDataSource(){
        let {sell, buy} = this.orderBook;
        let sellData: OrderBookTableModel[] = sell.map((item, index) => {
            let type = 'SELL';
            const {price, quantity} = item;
            return ({key: type+index, type, price: price / 1000, quantity: quantity / 1000});
        });

        let buyData: OrderBookTableModel[] = buy.map((item, index) => {
            let type = 'BUY';
            const {price, quantity} = item;
            return({key: type+index, type, price: price / 1000, quantity: quantity / 1000});
        });
        sellData = sellData.sort(sortBy('price'));
        buyData = buyData.sort(sortBy('price'));
        return {sellData, buyData};
    }

    /**
     * 获取最近交易组件Table的DataSource
     * @returns {[{key: number, price: number, quantity: number, time: any, direction: string},{key: number, price: number, quantity: number, time: any, direction: string},{key: number, price: number, quantity: number, time: any, direction: string},{key: number, price: number, quantity: number, time: any, direction: string},{key: number, price: number, quantity: number, time: any, direction: string}]}
     */
    @computed
    get tradeDataSource(){
        return this.trade.map((item, index) => {
            const {price, quantity, time, type} = item;
            return {key: index, direction: type, quantity: quantity / 1000, price: price / 1000, time};
        });
    }

}

export default new WS();