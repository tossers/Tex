import * as React from 'react';
import * as ReactGridLayout from 'react-grid-layout';
import {match} from 'react-router-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Product.css';
import {Entrust} from './Entrust';

export class Product extends React.Component<{
    match: match<{ id: number }>,
    getProduct: (productCode: string) => {},
    product: { name: string, id: number, code: string },
    entrust: (type: string, productId: string, price: number, quantity: number) => Promise<void>
}, { width: number }> {

    state = {
        width: 1200
    };

    componentWillMount() {
        //得到产品信息
        this.props.getProduct(this.props.match.params.id.toString());
    }

    componentDidUpdate() {
        //得到产品信息
        this.props.getProduct(this.props.match.params.id.toString());
    }

    render() {
        const {product,entrust} = this.props;
        return (
            <div>
                <h3>{this.props.product.name}({this.props.product.code})</h3>
                <ReactGridLayout className="layout product" cols={12} rowHeight={30} width={this.state.width}>
                    <div className="item" key="a" data-grid={{x: 0, y: 0, w: 4, h: 14}}>委托列表</div>
                    <div className="item" key="b" data-grid={{x: 4, y: 0, w: 5, h: 14}}>图表</div>
                    <div className="item" key="c" data-grid={{x: 9, y: 0, w: 3, h: 8}}>近期交易</div>
                    <div className="item" key="order" data-grid={{x: 9, y: 6, w: 3, h: 6}}>
                        <Entrust entrust={async (type: string, price: number, quantity: number) => {
                            return entrust(type, product.id.toString(), price, quantity);
                        }}/>
                    </div>
                    <div className="item" key="d" data-grid={{x: 0, y: 8, w: 9, h: 4}}>持有仓位</div>
                    <div className="item" key="e" data-grid={{x: 9, y: 8, w: 3, h: 4}}>保证金</div>
                </ReactGridLayout>
            </div>
        );

    }

}