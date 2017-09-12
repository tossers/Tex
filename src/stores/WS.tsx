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
    entrustType: string;     //'BUY' or 'SELL'
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
    // /**
    //  * 重置接收order的标志
    //  */
    // @action
    // setOnWSReceiveOrderFalse(){
    //     this.onWSReceiveOrder = false;
    // }

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

        if (!this.ws) {
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
        if (this.ws) {
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

    // throttle(delay: number, applyTime: number){
    //     if (this.timer) {
    //         clearTimeout(this.timer);
    //     }
    //
    //     let cur = Date.now();                   //记录当前时间
    //
    //     if (!this.start) {                      //若该函数是第一次调用，则直接设置_start,即开始时间，为_cur，即此刻的时间
    //         this.start = cur;
    //     }
    //
    //     if (cur - this.start > applyTime) {
    //         //当前时间与上一次函数被执行的时间作差，与mustApplyTime比较，若大于，则必须执行一次函数，若小于，则重新设置计时器
    //         this.start = cur;
    //         this.orderBook = this.orderBookBuffer;
    //         this.trade = this.tradeBuffer;
    //     } else {
    //         this.timer = setTimeout(() => {
    //             this.orderBook = this.orderBookBuffer;
    //             this.trade = this.tradeBuffer;
    //         }, delay);
    //     }
    // }

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
            return ({key: type+index, type, price, quantity});
        });

        let buyData: OrderBookTableModel[] = buy.map((item, index) => {
            let type = 'BUY';
            const {price, quantity} = item;
            return({key: type+index, type, price, quantity});
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
            const {price, quantity, time, entrustType} = item;
            return {key: index, direction: entrustType, quantity, price, time};
        });
    }

}

export default new WS();