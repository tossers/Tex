import {Table} from 'antd';
import * as React from 'react';

export class Transaction extends React.Component {

    render() {

        const data: { key: number, price: number, quantity: number, time: string, direction: string }[] = [];
        for (let i = 0; i < 100; i++) {
            data.push({
                key: i,
                price: i,
                quantity: i,
                time: new Date().toLocaleTimeString(),
                direction: 'B'
            });
        }
        const columns = [{
            title: '价格',
            dataIndex: 'price',
            width: 8
        }, {
            title: '交易量',
            dataIndex: 'quantity',
            width: 8
        }, {
            title: '时间',
            dataIndex: 'time',
            width: 80
        }, {
            title: '方向',
            dataIndex: 'direction',
            width: 8
        }];

        return (
            <Table showHeader={false} columns={columns} pagination={false} dataSource={data} scroll={{ y: 300 }} size="small" bordered={true}/>
        );
    }

}