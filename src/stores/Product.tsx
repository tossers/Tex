import {action, computed, observable} from 'mobx';
import {getProducts} from '../api/Index';
import {ws} from '../api/WebSocket';

export class Product {
    @observable id: number;
    @observable code: string;
    @observable name: string;
    @observable status: number;

}

export class ProductList {
    @observable list: Product[] = [];

    @observable currentProductCode: string = '';

    @observable orderBook: string[] = [];

    @observable min: string[] = [];

    @observable trade: string[] = [];

    isOnMessage: boolean = false;

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
    subscribe(productId: number) {

        if (!this.isOnMessage) {
            ws.onmessage = (evt) => {
                [].concat(JSON.parse(evt.data)).forEach(this.deal.bind(this));
            };
            this.isOnMessage = true;
        }

        ws.send(JSON.stringify({
            'op': 'subscribe',
            args: [`orderBook:${productId}`, `trade:${productId}`, `min${productId}`]
        }));
    }

    @action
    unSubscribe(productId: number) {
        ws.send(JSON.stringify({
            'op': 'unsubscribe',
            args: [`orderBook:${productId}`, `trade:${productId}`, `min${productId}`]
        }));
        this.min.splice(0, this.min.length);
        this.trade.splice(0, this.trade.length);
        this.orderBook.splice(0, this.orderBook.length);
    }

    deal(msg: { cmd: string }): void {
        switch (msg.cmd) {
            case 'orderBook':
                this.orderBook.push(JSON.stringify(msg));
                break;
            case 'min':
                this.min.push(JSON.stringify(msg));
                break;
            case 'trade':
                this.trade.push(JSON.stringify(msg));
                break;
            default:
                break;
        }
    }
}

export default new ProductList();