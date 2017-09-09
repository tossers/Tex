import * as React from 'react';
import {Table} from 'antd';
import {toFixed} from '../../util/index';
import { timeFormat } from 'd3-time-format';
import {ProductModel} from '../Product';

export interface OrderTableModel{
    key: number;
    prodcutId: number;      //产品id
    productName: string;    //产品名称
    price: number;          //价格
    quantity: number;       //数量
    date: number;           //时间
    type: number;           //1为主动买入，-1为主动卖出
    orderId: string;        //委托Id
}

export class OrderTable extends React.Component<{
    getDealOrders: (page: number, size: number) => Promise<void>;   //获取成交单
    products: ProductModel[];                                       //产品列表
    dataSource: OrderTableModel[];
    total: number;
    height: number,                                           //自适应高度
},{
    loading: boolean
}>{
    state = {
        loading: true,
    };

    componentWillMount(){
        this.props.getDealOrders(1, 10).then(() => {
            this.setState({loading: false});
        }).catch((ex) => {
            console.log(ex.message);
            this.setState({loading: false});
        });
    }

    handlePageChange = (page, pageSize) => {
        this.props.getDealOrders(page, pageSize).then(() => {
            this.setState({loading: false});
        }).catch((ex) => {
            console.log(ex.message);
            this.setState({loading: false});

        });
    }

    render() {
        const len = 6;
        const columns = [{
            title: '产品',
            indexData: 'productName',
            key: 'productName',
            width: 100/len + '%',
        },{
            title: '价格',
            indexDate: 'price',
            key: 'price',
            width: 100/len + '%',
            render: (text) => toFixed(text, 3)
        },{
            title: '数量',
            indexDate: 'quantity',
            key: 'quantity',
            width: 100/len + '%',
            render: (text) => toFixed(text, 3)
        },{
            title: '类型',
            indexDate: 'type',
            key: 'type',
            width: 100/len + '%',
            render: (text) => text === 1? '买入': '卖出'
        },{
            title: '委托id',
            indexDate: 'orderId',
            key: 'orderId',
            width: 100/len + '%',
        },{
            title: '时间',
            indexDate: 'date',
            key: 'date',
            width: 100/len + '%',
            render: (text) => timeFormat('%y-%m-%d %H:%M:%S')(new Date(text))
        }];

        const {dataSource, height, total} = this.props;
        return (
            <Table
                loading={this.state.loading}
                dataSource={dataSource}
                columns={columns}
                size="small"
                pagination={{total, onChange: () => this.handlePageChange}}
                scroll={{y: height * 62 - 150}}
            />
        );
    }
}