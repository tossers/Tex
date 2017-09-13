import * as React from 'react';
import {match} from 'react-router-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Product.css';
import {Card, Button, InputNumber, Modal} from 'antd';
import {Inventory} from './Inventory/Inventory';
import {config} from '../config';
import {Responsive, WidthProvider} from 'react-grid-layout';
import {toFixed} from '../util';
import {TransactionC, RecentTradeTableModel} from './Transaction/TransactionC';
import {AssetsC, AssetsModel} from './Assets/AssetsC';
import {OrderBookC, OrderBookTableModel} from './OrderBook/OrderBookC';
import {EntrustC} from './Entrust/EntrustC';
import {MyModal} from './MyModal/MyModal';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const initLayouts = localStorage.layouts? JSON.parse(localStorage.layouts): config.initLayouts;

export interface LayoutModel{
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minH: number;
}

export interface ProductModel {
    id: number;     //产品id
    code: string;   //产品代码
    name: string;   //产品名称
    status: number; //产品状态
}

interface OrderBookModel{
    sellData: OrderBookTableModel[];
    buyData: OrderBookTableModel[];
}

export class Product extends React.Component<{
    assetsId: number;                                       //资金账户id
    lastPrice: number;                                      //最新价格
    onWSReceiveOrder: boolean;                              //ws接收到order信息标志
    assets: AssetsModel;                                    //用户资金
    orderBook: OrderBookModel;                              //盘口信息
    trade: RecentTradeTableModel[];                         //最近成交
    getPositionList:() => void;                             //获取持仓列表
    getUserAssets: () => void;                              //获取用户资金
    updateDealOrders:() => void;                            //更新成交单
    updateEntrustList: () => void;                          //更新委托列表
    subscribe:(productId:number, assetsId: number)=>void;   //ws订阅
    unSubscribe:(productId:number)=>void;                   //ws取消订阅
    setCardHeight: (currentLayout: LayoutModel[]) => void;
    getProduct: (productCode: string) => {};
    product: ProductModel;
    match: match<{ id: number }>;
    setLastPriceClolr: (color: string) => void;
    lastPriceClolr: string;
    recharge: () => Promise<void>;
    changeRechargeMoney: () => void;
    onRecharge: boolean;
    setOnRecharge: (flag: boolean) => void;
    rechargeMoney: number;
},{}> {
    componentDidMount() {
        this.props.getProduct(this.props.match.params.id.toString());
    }

    componentDidUpdate() {
        //得到产品信息
        this.props.getProduct(this.props.match.params.id.toString());
    }

    componentWillReceiveProps(props: { trade: RecentTradeTableModel[], product: { id: number }, assetsId: number, onWSReceiveOrder: boolean}) {
        if(props.onWSReceiveOrder && !this.props.onWSReceiveOrder){
            this.props.getPositionList();
            this.props.getUserAssets();
            this.props.updateDealOrders();
            this.props.updateEntrustList();
        }

        if(this.props.trade[0] && props.trade[0]){
            if(props.trade[0].price - this.props.trade[0].price > 0){
                this.props.setLastPriceClolr('rgb(174, 84, 59)');
            }else{
                this.props.setLastPriceClolr('rgb(62, 134, 84)');
            }
        }

        if (this.props.product.id !== props.product.id) {
            if(this.props.product.id){
                this.props.unSubscribe(this.props.product.id);
            }
            this.props.subscribe(props.product.id, props.assetsId);
        }
    }

    onLayoutChange = (currentLayout, allLayouts) => {
        // console.log('onLayoutChange');
        this.props.setCardHeight(currentLayout);
        localStorage.layouts = JSON.stringify(allLayouts);
    }

    chartTitle = () => {
        const {orderBook, trade, lastPriceClolr} = this.props;
        const {buyData, sellData} = orderBook;
        return (
            <div style={{width: '100%'}}>
                <span>图表</span>
                <div className="detailHeader">
                    <div>买一价/卖一价</div>
                    <div className="numberFont">
                        {buyData[0]? toFixed(buyData[0].price, 3): 0}
                        /
                        {sellData[sellData.length - 1]? toFixed(sellData[sellData.length - 1].price, 3): 0}
                    </div>
                </div>
                <div className="detailHeader">
                    <div>最新价</div>
                    <div className="numberFont" style={{color: lastPriceClolr}}>
                        {trade[0]? toFixed(trade[0].price, 3): 0}
                    </div>
                </div>
            </div>
        );
    }

    bondTitle = () => {
        const {rechargeMoney, onRecharge, recharge, changeRechargeMoney, setOnRecharge, getUserAssets} = this.props;
        return (
            <div>
                <span>保证金</span>
                <MyModal
                    title="充值"
                    content={
                        <InputNumber
                            min={1}
                            precision={3}
                            defaultValue={rechargeMoney}
                            onChange={changeRechargeMoney}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                    }
                    handleOk={recharge}>
                    <Button
                        type="primary"
                        ghost={true}
                        style={{float: 'right', marginTop: '10px'}}
                    >充值</Button>
                </MyModal>
                <Modal visible={onRecharge}
                       onCancel={() => setOnRecharge(false)}
                       onOk={() => {setOnRecharge(false);getUserAssets();}}>
                    <h2>是否已完成充值</h2>
                </Modal>
            </div>
        );
    }

    render() {
        const {product,} = this.props;
        return (
            //rowHeight有10px的误差
            <ResponsiveReactGridLayout
                className="layout product"
                rowHeight={62 - 10}
                layouts={initLayouts}
                onLayoutChange={this.onLayoutChange}
                breakpoints={{md: 1000, sm: 780, xs: 450, xxs: 0}}
                cols={{lg: 12, md: 12, sm: 12, xs: 12, xxs: 12}}
            >
                <Card className="item" title="委托列表" key="entrustList" ><OrderBookC /></Card>
                <Card className="item" title={this.chartTitle()} key="chart">
                    <iframe
                        style={{border: '0', width: '100%', height: '100%'}}
                        src={'http://chart.tex.tuling.me/?productId=' + product.id}
                    />
                </Card>
                <Card className="item" title="近期交易" key="trading" ><TransactionC /></Card>
                <Card className="item" title="委托" key="entrust"><EntrustC /></Card>
                <Card className="item" key="position" ><Inventory /></Card>
                <Card className="item" title={this.bondTitle()} key="bond" ><AssetsC /></Card>
            </ResponsiveReactGridLayout>
        );
    }
}