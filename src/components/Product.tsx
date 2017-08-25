import * as React from 'react';
import * as ReactGridLayout from 'react-grid-layout';
import {match} from 'react-router-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Product.css';
import {Entrust} from './Entrust';
import {Card} from 'antd';
import {Position} from './Position';
import {Transaction} from './Transaction';
import YStockChart from './YStockChart';
import {OrderBook} from './OrderBook/OrderBook';

interface P {
    x: number;
    y: number;
    w: number;
    h: number;
}

export class Product extends React.Component<{
    match: match<{ id: number }>,
    getProduct: (productCode: string) => {},
    product: { name: string, id: number, code: string },
    entrust: (type: string, productId: string, price: number, quantity: number) => Promise<void>,
    entrusts: { id: number, price: number, quantity: number }[],
    getEntrusts: (productId: string) => Promise<void>,
    delEntrust: (entrustId:number)=>Promise<void>,
    sellData,
    buyData,
    getOrderBook,
    subscribe:(productId:number)=>void,
    unSubscribe:(productId:number)=>void,
    transaction:any,
    getTransactionData,
    charData,
    getMinLine,
    ws,
}, { width: number, settings: { chart: P, entrustList: P, trading: P, entrust: P, position: P, bond: P } }> {

    state = {
        width: 1200,
        settings: {
            ...(JSON.parse(localStorage.settings || '{}'))
        }
    };

    componentDidMount() {
        const {getTransactionData, getMinLine, getOrderBook, ws} = this.props
        ws.onmessage = (evt) => {
            const received_msg = JSON.parse(evt.data);
            console.log("ws数据已接受");
            console.log(received_msg);
            if (received_msg.cmd === 'orderBook') {
                getOrderBook(received_msg.data)
            }else if(received_msg.cmd === 'trade'){
            }else if(received_msg.cmd === 'min'){
                received_msg.data.forEach((item) => {
                    getMinLine(item)
                })
            }else if(received_msg.length > 0){
                received_msg.forEach((obj) => {
                    if(obj.cmd === 'orderBook'){
                        getOrderBook(obj.data)
                    }else if(obj.cmd === 'trade'){
                        getTransactionData(obj.data)
                    }else if(obj.cmd === 'min'){
                        getMinLine(obj.data)
                    }
                })
            }
        }
        this.props.getProduct(this.props.match.params.id.toString());
    }

    componentDidUpdate() {
        //得到产品信息
        this.props.getProduct(this.props.match.params.id.toString());
    }

    componentWillReceiveProps(props: { product: { id: number } }) {
        if (this.props.product.id !== props.product.id) {
            this.props.getEntrusts(props.product.id.toString());
            this.props.unSubscribe(this.props.product.id);
            this.props.subscribe(props.product.id);
        }
    }

    render() {
        const {product, entrust, entrusts, charData, sellData, buyData,transaction} = this.props;
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
                    <OrderBook sellData={sellData} buyData={buyData}/>
                </Card>
                <Card className="item" title="图表" key="chart"
                      data-grid={this.state.settings.chart || {x: 4, y: 0, w: 5, h: 14}}>
                    <div><YStockChart data={charData}/></div>
                </Card>

                <Card className="item" title="近期交易" key="trading"
                      data-grid={this.state.settings.trading || {x: 9, y: 0, w: 3, h: 8}}>
                    <Transaction dataSource={transaction}/>
                </Card>
                <Card className="item" title="委托" key="entrust"
                      data-grid={this.state.settings.entrust || {x: 9, y: 6, w: 3, h: 6}}>
                    <Entrust entrust={async (type: string, price: number, quantity: number) => {
                        return entrust(type, product.id.toString(), price, quantity);
                    }}/>
                </Card>

                <Card className="item" key="position"
                      data-grid={this.state.settings.position || {x: 0, y: 8, w: 9, h: 4}}>
                    <Position entrusts={entrusts} onDeleteEntrust={this.props.delEntrust} onUpdate={()=>{
                        this.props.getEntrusts(this.props.product.id.toString());
                    }}/>
                </Card>
                <Card className="item" title="保证金" key="bond"
                      data-grid={this.state.settings.bond || {x: 9, y: 8, w: 3, h: 4}}>保证金</Card>
            </ReactGridLayout>
        );

    }

}