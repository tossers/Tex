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
    entrusts: { id: number, price: number, quantity: number }[];
    getEntrusts: (productId: string) => Promise<void>;
    delEntrust: (entrustId:number)=>Promise<void>;

}, { width: number, settings: { chart: P, entrustList: P, trading: P, entrust: P, position: P, bond: P } }> {

    state = {
        width: 1200,
        settings: {
            ...(JSON.parse(localStorage.settings || '{}'))
        }
    };

    componentDidMount() {
        this.props.getProduct(this.props.match.params.id.toString());
    }

    componentDidUpdate() {
        //得到产品信息
        this.props.getProduct(this.props.match.params.id.toString());
    }

    componentWillReceiveProps(props: { product: { id: number } }) {
        if (this.props.product.id !== props.product.id) {
            this.props.getEntrusts(props.product.id.toString());
        }
    }

    render() {
        const {product, entrust, entrusts} = this.props;
        return (
            <ReactGridLayout autoSize={true} onLayoutChange={(layout) => {
                var result: { [propName: string]: { [propName: string]: number } } = {};
                layout.forEach((item) => {
                    result[item.i] = item;
                });
                localStorage.settings = JSON.stringify(result);
            }} className="layout product" cols={12} rowHeight={36} width={this.state.width}>
                <Card className="item" title="委托列表" key="entrustList"
                      data-grid={this.state.settings.entrustList || {x: 0, y: 0, w: 4, h: 14}}>委托列表</Card>
                <Card className="item" title="图表" key="chart"
                      data-grid={this.state.settings.chart || {x: 4, y: 0, w: 5, h: 14}}>图表</Card>
                <Card className="item" title="近期交易" key="trading"
                      data-grid={this.state.settings.trading || {x: 9, y: 0, w: 3, h: 8}}>
                    <Transaction/>
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