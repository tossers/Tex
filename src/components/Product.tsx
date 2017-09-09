import * as React from 'react';
import {match} from 'react-router-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Product.css';
import {Entrust} from './Entrust';
import {Card} from 'antd';
import {Inventory, PositionTableModel, EntrustTableModel, OrderTableModel} from './Inventory/index';
import {RecentTradeTableModel, Transaction} from './Transaction';
import {OrderBook, OrderBookTableModel} from './OrderBook/index';
import {Assets, AssetsModel} from './Assets/Assets';
import {config} from '../config';
import {Responsive, WidthProvider} from 'react-grid-layout';
import {toFixed} from '../util';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const initLayouts = localStorage.layouts? JSON.parse(localStorage.layouts): config.initLayouts;

interface LayoutModel{
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
    ordersTotal: number;                                    //成交单总数
    dealOrders: OrderTableModel[];                          //成交单
    assetsId: number;                                       //资金账户id
    lastPrice: number;                                      //最新价格
    onWSReceiveOrder: boolean;                              //ws接收到order信息标志
    products: ProductModel[];                               //产品列表
    assets: AssetsModel;                                    //用户资金
    orderBook: OrderBookModel;                              //盘口信息
    trade: RecentTradeTableModel[];                         //最近成交
    entrusts: EntrustTableModel[];                          //委托列表
    positionsDataSource: PositionTableModel[];              //持仓列表
    getPositionList:() => void;                             //获取持仓列表
    deletePosition:(id: number) => Promise<void>;           //平仓操作
    getUserAssets: () => Promise<void>;                     //获取用户资金
    setOnWSReceiveOrderFalse: () => void;                   //将ws接收到order信息标志重置
    subscribe:(productId:number, assetsId: number)=>void;   //ws订阅
    unSubscribe:(productId:number)=>void;                   //ws取消订阅
    getDealOrders: (page: number, size: number) => Promise<void>; //获取成交单
    getProduct: (productCode: string) => {};
    product: ProductModel;
    match: match<{ id: number }>;
    getEntrusts: () => Promise<void>;
    delEntrust: (entrustId: number) => Promise<void>;
    entrust: (type: string, productId: string, price: number, quantity: number, lever: number) => Promise<void>;
}, {
    orderBookHeight: number;
    positionHeight: number;
    transactionHeight: number;
    lastPriceClolr: string;
}> {

    state = {
        orderBookHeight: 5,
        transactionHeight: 4,
        positionHeight: 5,
        lastPriceClolr: 'rgb(62, 134, 84)',
    };

    componentDidMount() {
        this.props.getProduct(this.props.match.params.id.toString());
        this.onUpdate();
    }

    componentDidUpdate() {
        //得到产品信息
        this.props.getProduct(this.props.match.params.id.toString());
    }

    componentWillReceiveProps(props: { trade: RecentTradeTableModel[], product: { id: number }, assetsId: number, onWSReceiveOrder: boolean}) {
        if(props.onWSReceiveOrder){
            this.props.setOnWSReceiveOrderFalse();
            this.onUpdate();
        }

        if(this.props.trade[0] && props.trade[0]){
            if(props.trade[0].price - this.props.trade[0].price > 0){
                this.setState({lastPriceClolr: 'rgb(174, 84, 59)'});
            }else{
                this.setState({lastPriceClolr: 'rgb(62, 134, 84)'});
            }
        }

        if (this.props.product.id !== props.product.id) {
            if(this.props.product.id){
                this.props.unSubscribe(this.props.product.id);
            }
            this.props.subscribe(props.product.id, props.assetsId);
        }
    }

    onLayoutChange = (currentLayout: LayoutModel[], allLayouts: LayoutModel) => {
        currentLayout.forEach((item) => {
            if(item.i === 'trading'){
                this.setState({transactionHeight: item.h});
            }else if(item.i === 'position'){
                this.setState({positionHeight: item.h});
            }else if(item.i === 'entrustList'){
                this.setState({orderBookHeight: item.h});
            }
        });
        localStorage.layouts = JSON.stringify(allLayouts);
    }

    onUpdate = () => {
        this.props.getPositionList();
        this.props.getEntrusts();
        this.props.getUserAssets();
    }

    chartTitle = (color: string) => {
        const {orderBook, trade} = this.props;
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
                    <div className="numberFont" style={{color}}>{trade[0]? toFixed(trade[0].price, 3): 0}</div>
                </div>
            </div>
        );
    }

    render() {
        const {
            getEntrusts,
            getUserAssets,
            getPositionList,
            products,
            product,
            entrust,
            entrusts,
            orderBook,
            trade,
            deletePosition,
            positionsDataSource,
            assets,
            lastPrice,
            dealOrders,
        } = this.props;

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
                <Card className="item" title="委托列表" key="entrustList" >
                    <OrderBook
                        height={this.state.orderBookHeight}
                        buyData={orderBook.buyData}
                        sellData={orderBook.sellData}
                    />
                </Card>
                <Card className="item" title={this.chartTitle(this.state.lastPriceClolr)} key="chart">
                    <iframe
                        style={{border: '0', width: '100%', height: '100%'}}
                        src={'http://chart.tex.tuling.me/?productId=' + product.id}
                    />
                </Card>
                <Card className="item" title="近期交易" key="trading" >
                    <Transaction
                        dataSource={trade}
                        height={this.state.transactionHeight}
                    />
                </Card>
                <Card className="item" title="委托" key="entrust">
                    <Entrust
                        availableassets={assets.available}
                        lastPrice={lastPrice}
                        onUpdate={this.onUpdate}
                        entrust={async (type: string, price: number, quantity: number, lever: number) => {
                        return entrust(type, product.id.toString(), price, quantity, lever);
                    }}/>
                </Card>
                <Card className="item" key="position" >
                    <Inventory
                        ordersTotal={this.props.ordersTotal}
                        getDealOrders={this.props.getDealOrders}
                        dealOrders={dealOrders}
                        updateEntrust={getEntrusts}
                        updatePositionList={getPositionList}
                        updateUserAssets={getUserAssets}
                        availableAssets={assets.available}
                        products={products}
                        height={this.state.positionHeight}
                        deletePosition={deletePosition}
                        positionsDataSource={positionsDataSource}
                        entrusts={entrusts}
                        onDeleteEntrust={this.props.delEntrust}
                    />
                </Card>
                <Card className="item" title="保证金" key="bond" >
                    <Assets assets={assets}/>
                </Card>
            </ResponsiveReactGridLayout>
        );

    }

}