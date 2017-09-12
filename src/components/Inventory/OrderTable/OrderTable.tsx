import * as React from 'react';
import {Table} from 'antd';
import {toFixed} from '../../../util/index';
import { timeFormat } from 'd3-time-format';

export interface OrderTableModel{
    key: number;
    productName: string;    //产品名称
    price: number;          //价格
    quantity: number;       //数量
    time: number;           //时间
    type: number;           //1为主动买入，-1为主动卖出
    orderId: string;        //委托Id
}

export interface Props{
    dataSource: OrderTableModel[];
    total: number;
    height: number;
    loading: boolean;
    getDealOrders: (page: number) => void;
}

export class OrderTable extends React.Component<Props|{}, {}> {

    componentWillMount() {
        const {getDealOrders} = this.props as Props;
        getDealOrders(1);
    }

    render() {
        const len = 6;
        const columns = [{
            title: '产品',
            dataIndex: 'productName',
            key: 'productName',
            width: 100/len + '%',
        },{
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: 100/len + '%',
            render: (text) => toFixed(text, 3)
        },{
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100/len + '%',
            render: (text) => toFixed(text, 3)
        },{
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 100/len + '%',
            render: (text) => text === 1? '买入': '卖出'
        },{
            title: '委托id',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 100/len + '%',
        },{
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            width: 100/len + '%',
            render: (text) => {
                return timeFormat('%y-%m-%d %H:%M:%S')(new Date(text));
            }
        }];
        const {dataSource, total, height, getDealOrders, loading} = this.props as Props;
        return (
            <Table
                loading={loading}
                dataSource={dataSource}
                columns={columns}
                size="small"
                pagination={total < 100 ? false : {total,  pageSize: 100, onChange: () => getDealOrders}}
                scroll={{y: height * 62 - (total > 100 ? 175 : 150)}}
            />
        );
    }
}