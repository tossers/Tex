import {action, observable} from 'mobx';
import {LayoutModel} from '../components/Product';

//杂项
export class Odd {
    @observable orderBookHeight: number = 5;
    @observable inventoryHeight: number = 4;
    @observable transactionHeight: number = 5;
    @observable lastPriceClolr: string = 'rgb(174, 84, 59)';

    /**
     * 设置最新价颜色
     * @param color
     */
    @action
    setLastPriceClolr(color: string){
        this.lastPriceClolr = color;
    }

    /**
     * 设置自适应高度
     * @param currentLayout
     */
    @action
    setCardHeight(currentLayout: LayoutModel[]) {
        currentLayout.forEach((item) => {
            if(item.i === 'trading'){
                this.transactionHeight = item.h;
            }else if(item.i === 'position'){
                this.inventoryHeight = item.h;
            }else if(item.i === 'entrustList'){
                this.orderBookHeight = item.h;
            }
        });
    }
}

export default new Odd();