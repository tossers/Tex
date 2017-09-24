import * as React from 'react';
import {Table} from 'antd';
import {toFixed} from '../../util/index';

export interface OrderBookTableModel {
    key: string;
    price: number;
    quantity: number;
    type: string;      //'BUY' or 'SELL'
}

const columns = [{
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    width: '33.33%',
    render: (text, record, index) =>
        (
            <span style={{
                fontWeight: 'bold',
                color: record.type === 'BUY' ? '#ae543b' : '#3e8654'
            }}>{toFixed(text, 3)}</span>
        )
}, {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity',
    width: '33.33%',
    render: (text) => (toFixed(text, 3))
}];

export class OrderBookTable extends React.Component<{
        dataSource: OrderBookTableModel[],
        showHeader: boolean
    }> {
    render() {
        let {dataSource, showHeader} = this.props;
        return (
            <Table
                size="small"
                dataSource={dataSource}
                showHeader={showHeader}
                bordered={true}
                pagination={false}
                columns={columns}
            />
        );
    }
}