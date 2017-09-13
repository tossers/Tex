import {Product as Component, LayoutModel} from '../components/Product';
import {inject, observer} from 'mobx-react';

@inject((stores, props) => {
    return {
        ...props,
        lastPrice: stores.wsStore.lastPrice,                   //最新价格
        orderBook:stores.wsStore.orderBookDataSource,
        trade:stores.wsStore.tradeDataSource,
        onWSReceiveOrder: stores.wsStore.onWSReceiveOrder,
        product: stores.productStore.current,
        assetsId: stores.userStore.assetsId,
        assets: stores.assetsStore.assets,
        orderBookHeight: stores.oddStore.orderBookHeight,
        positionHeight: stores.oddStore.positionHeight,
        transactionHeight: stores.oddStore.transactionHeight,
        lastPriceClolr: stores.oddStore.lastPriceClolr,
        getUserAssets: () => stores.assetsStore.getUserAssets(),
        getProduct: (productCode: string) => stores.productStore.setCurrent(productCode),
        subscribe:(productId:number, assetsId: number)=> stores.wsStore.subscribe(productId, assetsId),
        unSubscribe:(productId:number)=>stores.wsStore.unSubscribe(productId),
        getPositionList: () => stores.positionStore.getPositionList(),
        updateDealOrders: () => stores.dealOrderStore.updateDealOrders(),
        updateEntrustList: ()=> stores.entrustStore.updateEntrustList(),                                //更新委托列表
        setCardHeight: (currentLayout: LayoutModel[]) => stores.oddStore.setCardHeight(currentLayout),
        setLastPriceClolr: (color: string) => stores.oddStore.setLastPriceClolr(color),
        recharge: () => stores.userStore.recharge(),
        changeRechargeMoney: (money: number) => stores.userStore.changeRechargeMoney(money),
        onRecharge: stores.userStore.onRecharge,
        rechargeMoney: stores.userStore.rechargeMoney,
        setOnRecharge: (flag: boolean) => stores.userStore.setOnRecharge(flag),
    };
})

@observer
export class Product extends Component {

}