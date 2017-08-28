import * as React from 'react';
import * as ReactGridLayout from 'react-grid-layout';
import {match} from 'react-router-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Product.css';
import {Entrust} from './Entrust';
import {Card} from 'antd';
import {Position, PositionTableModel} from './APosition';
import {RecentTrade, Transaction} from './Transaction';
import {OrderBook} from './OrderBook/OrderBook';
interface OneOrder{
    price:number;
    quantity:number;
    total:number;
    type:string;
    key: [number, string];
}
interface P {
    x: number;
    y: number;
    w: number;
    h: number;
}
interface AssetsModel{
    availableassets: number;
    frozenassets: number;
    id: number;
    status: number;
    uid: number;
}
export class Product extends React.Component<{
    //1.持仓列表； 2.获取持仓列表； 3.平仓操作；
    positionDataSource: Array<PositionTableModel>;
    getPositionList:() => void;
    deletePosition:(id: number) => Promise<void>;

    onWSReceiveOrder: boolean;
    setOnWSReceiveOrderFalse: () => void;
    assets: AssetsModel;
    getUserAssets: () => void;
    match: match<{ id: number }>;
    assetsId: number;
    getProduct: (productCode: string) => {};
    product: { name: string, id: number, code: string};
    min: string[];
    trade: RecentTrade[];
    orderBook: {sellData:OneOrder[];
    buyData:OneOrder[]};
    subscribe:(productId:number, assetsId: number)=>void;
    unSubscribe:(productId:number)=>void;
    entrust: (type: string, productId: string, price: number, quantity: number, lever: number) => Promise<void>;
    entrusts: { id: number, price: number, quantity: number }[];
    getEntrusts: (productId: string) => Promise<void>;
    delEntrust: (entrustId: number) => Promise<void>;
}, { width: number, settings: { chart: P, entrustList: P, trading: P, entrust: P, position: P, bond: P } }> {

    state = {
        width: 1200,
        settings: {
            ...(JSON.parse(localStorage.settings || '{}'))
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
            this.props.getPositionList();
            this.props.getUserAssets();
        }

        if (this.props.product.id !== props.product.id) {
            this.props.getEntrusts(props.product.id.toString());
            if(!this.props.product.id){
                this.props.unSubscribe(this.props.product.id);
            }
            this.props.subscribe(props.product.id, props.assetsId);
        }
    }

    render() {
        const {product, entrust, entrusts, orderBook, trade, deletePosition, positionDataSource, assets, getEntrusts} = this.props;
        return (
            <ReactGridLayout autoSize={true} onLayoutChange={(layout) => {
                var result: { [propName: string]: { [propName: string]: number } } = {};
                layout.forEach((item) => {
                    result[item.i] = item;
                });
                localStorage.settings = JSON.stringify(result);
            }} className="layout product" cols={12} rowHeight={36} width={this.state.width}>
                <Card className="item" title="委托列表" key="entrustList"
                      data-grid={this.state.settings.entrustList || {x: 0, y: 0, w: 4, h: 14}}>
                    <OrderBook buyData={orderBook.buyData} sellData={orderBook.sellData} />
                </Card>
                <Card className="item" title="图表" key="chart"
                      data-grid={this.state.settings.chart || {x: 4, y: 0, w: 5, h: 14}}>
                    <iframe style={{border: '0', width: '100%', height: '100%'}} src={'http://chart.tex.tuling.me/?productId=' + product.id} />
                </Card>
                <Card className="item" title="近期交易" key="trading"
                      data-grid={this.state.settings.trading || {x: 9, y: 0, w: 3, h: 8}}>
                    <Transaction dataSource={trade}/>
                </Card>
                <Card className="item" title="委托" key="entrust"
                      data-grid={this.state.settings.entrust || {x: 9, y: 6, w: 3, h: 6}}>
                    <Entrust entrust={async (type: string, price: number, quantity: number, lever: number) => {
                        return entrust(type, product.id.toString(), price, quantity, lever);
                    }}/>
                </Card>

                <Card className="item" key="position"
                      data-grid={this.state.settings.position || {x: 0, y: 8, w: 9, h: 4}}>
                    <Position
                        deletePosition={deletePosition}
                        positionDataSource={positionDataSource}
                        entrusts={entrusts}
                        onDeleteEntrust={this.props.delEntrust}
                        onUpdate={() => getEntrusts(this.props.product.id.toString())}
                    />
                </Card>

                <Card className="item" title="保证金" key="bond"
                      data-grid={this.state.settings.bond || {x: 9, y: 8, w: 3, h: 4}}>
                    <ul style={{padding: '16px'}}>
                        <li><span>用户ID:</span><span className="assetSpan">{assets.uid}</span></li>
                        <li><span>用户状态:</span><span className="assetSpan">{assets.status===1?'可用':'不可用'}</span></li>
                        <li><span>资金账户ID:</span><span className="assetSpan">{assets.id}</span></li>
                        <li><span>可用资金:</span><span className="assetSpan">{assets.availableassets.toFixed(4)}</span></li>
                        <li><span>冻结资金:</span><span className="assetSpan">{assets.frozenassets.toFixed(4)}</span></li>
                    </ul>
                </Card>
            </ReactGridLayout>
        );

    }

}