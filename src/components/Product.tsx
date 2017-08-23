import * as React from 'react';
import * as ReactGridLayout from 'react-grid-layout';
import {match} from 'react-router-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Product.css';
import {Entrust} from './Entrust';
import {Card} from 'antd';

export class Product extends React.Component<{
    match: match<{ id: number }>,
    getProduct: (productCode: string) => {},
    product: { name: string, id: number, code: string },
    entrust: (type: string, productId: string, price: number, quantity: number) => Promise<void>
}, { width: number}> {

    state = {
        width: 1200
    };

    componentDidMount(){
        this.props.getProduct(this.props.match.params.id.toString());
    }

    componentDidUpdate() {
        //得到产品信息
        this.props.getProduct(this.props.match.params.id.toString());
    }

    render() {
        const {product, entrust} = this.props;
        return (
            <ReactGridLayout className="layout product" cols={12} rowHeight={36} width={this.state.width}>
                <Card className="item" title="委托列表" key="a" data-grid={{x: 0, y: 0, w: 4, h: 14}}>委托列表</Card>
                <Card className="item" title="图表" key="b" data-grid={{x: 4, y: 0, w: 5, h: 14}}>图表</Card>
                <Card className="item" title="近期交易" key="c" data-grid={{x: 9, y: 0, w: 3, h: 8}}>近期交易</Card>
                <Card className="item" title="委托" key="order" data-grid={{x: 9, y: 6, w: 3, h: 6}}>
                    <Entrust entrust={async (type: string, price: number, quantity: number) => {
                        return entrust(type, product.id.toString(), price, quantity);
                    }}/>
                </Card>

                <Card className="item" title="持有仓位" key="d" data-grid={{x: 0, y: 8, w: 9, h: 4}}>持有仓位</Card>
                <Card className="item" title="保证金" key="e" data-grid={{x: 9, y: 8, w: 3, h: 4}}>保证金</Card>
            </ReactGridLayout>
        );

    }

}