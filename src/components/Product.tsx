import * as React from 'react';
import {match} from 'react-router-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Product.css';
import {Entrust} from './Entrust';
import {Card} from 'antd';
import {Position, PositionTableModel, EntrustTableModel} from './APosition';
import {RecentTrade, Transaction} from './Transaction';
import {OrderBook} from './OrderBook/OrderBook';
import {config} from '../config';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive)
const {initLayouts} = config;

interface OneOrder{
    price: number;
    quantity: number;
    total: number;
    type: string;
    key: number;
}

interface AssetsModel{
    availableassets: number;
    frozenassets: number;
    id: number;
    status: number;
    uid: number;
}
export class Product extends React.Component<{
    lastPrice: number;                              //最新价格
    //1.持仓列表； 2.获取持仓列表； 3.平仓操作；
    positionsDataSource: Array<PositionTableModel>;
    getPositionList:() => void;
    deletePosition:(id: number) => Promise<void>;

    //1.用户资金；2.获取用户资金
    assets: AssetsModel;
    getUserAssets: () => Promise<void>;

    onWSReceiveOrder: boolean;
    setOnWSReceiveOrderFalse: () => void;
    match: match<{ id: number }>;
    assetsId: number;
    getProduct: (productCode: string) => {};
    product: { name: string, id: number, code: string};
    min: string[];
    trade: RecentTrade[];
    orderBook: {sellData:OneOrder[]; buyData:OneOrder[]};
    subscribe:(productId:number, assetsId: number)=>void;
    unSubscribe:(productId:number)=>void;
    entrust: (type: string, productId: string, price: number, quantity: number, lever: number) => Promise<void>;
    entrusts: EntrustTableModel[];
    getEntrusts: (productId: string) => Promise<void>;
    delEntrust: (entrustId: number) => Promise<void>;
}, {
    orderBookHeight: number;
    positionHeight: number;
    transactionHeight: number,
    layouts: {md: {}[], sm: {}[], xs: {}[], xxs: {}[]},
}> {

    state = {
        orderBookHeight: 5,
        transactionHeight: 4,
        positionHeight: 5,
        layouts: {
            ...(localStorage.layouts? JSON.parse(localStorage.layouts): initLayouts)
        }
    };

    componentDidMount() {
        this.props.getProduct(this.props.match.params.id.toString());
        this.props.getPositionList();
        this.props.getUserAssets();
    }

    componentDidUpdate() {
        //得到产品信息
        this.props.getProduct(this.props.match.params.id.toString());
    }

    componentWillReceiveProps(props: { product: { id: number }, assetsId: number, onWSReceiveOrder: boolean}) {

        if(props.onWSReceiveOrder){
            this.props.setOnWSReceiveOrderFalse();
            this.props.getPositionList();
            this.props.getUserAssets();
        }

        if (this.props.product.id !== props.product.id) {
            this.props.getEntrusts(props.product.id.toString());
            if(this.props.product.id){
                this.props.unSubscribe(this.props.product.id);
            }
            this.props.subscribe(props.product.id, props.assetsId);
        }
    }

    render() {
        const {product, entrust, entrusts, orderBook, trade, deletePosition, positionsDataSource, assets, lastPrice, getEntrusts, getUserAssets} = this.props;
        const {layouts} = this.state;
        return (
            <ResponsiveReactGridLayout
                layouts={layouts}
                breakpoints={{md: 1000, sm: 780, xs: 450, xxs: 0}}
                cols={{lg: 12, md: 12, sm: 12, xs: 12, xxs: 12}}
                onLayoutChange={(currentLayout, allLayouts) => {
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
            }} className="layout product" rowHeight={62 - 10}>
                <Card className="item" title="委托列表" key="entrustList" >
                    <OrderBook height={this.state.orderBookHeight} buyData={orderBook.buyData} sellData={orderBook.sellData} />
                </Card>
                <Card className="item" title="图表" key="chart">
                    <iframe style={{border: '0', width: '100%', height: '100%'}} src={'http://chart.tex.tuling.me/?productId=' + product.id} />
                </Card>
                <Card className="item" title="近期交易" key="trading" >
                    <Transaction dataSource={trade} height={this.state.transactionHeight}/>
                </Card>
                <Card className="item" title="委托" key="entrust">
                    <Entrust
                        availableassets={assets.availableassets}
                        lastPrice={lastPrice}
                        onUpdate={()=> getEntrusts(product.id.toString()).then(()=>getUserAssets())}
                        entrust={async (type: string, price: number, quantity: number, lever: number) => {
                        return entrust(type, product.id.toString(), price, quantity, lever);
                    }}/>
                </Card>
                <Card className="item" key="position" >
                    <Position
                        height={this.state.positionHeight}
                        deletePosition={deletePosition}
                        positionsDataSource={positionsDataSource}
                        entrusts={entrusts}
                        onDeleteEntrust={this.props.delEntrust}
                        onUpdate={()=> getEntrusts(product.id.toString()).then(()=>getUserAssets())}
                    />
                </Card>
                <Card className="item" title="保证金" key="bond" >
                    <ul style={{padding: '16px'}}>
                        <li><span>用户ID:</span><span className="assetSpan">{assets.uid}</span></li>
                        <li><span>用户状态:</span><span className="assetSpan">{assets.status===1?'可用':'不可用'}</span></li>
                        <li><span>资金账户ID:</span><span className="assetSpan">{assets.id}</span></li>
                        <li><span>可用资金:</span><span className="assetSpan">{assets.availableassets.toFixed(3)}</span></li>
                        <li><span>冻结资金:</span><span className="assetSpan">{assets.frozenassets.toFixed(3)}</span></li>
                    </ul>
                </Card>
            </ResponsiveReactGridLayout>
        );

    }

}