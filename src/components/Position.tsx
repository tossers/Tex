import {Tabs, Table} from 'antd';
import * as React from 'react';

const TabPane = Tabs.TabPane;

export class Position extends React.Component<{ entrusts: { id: number, price: number; quantity: number }[] }, {}> {

    render() {

        const columns = [{
            title: '合约',
            dataIndex: 'code',
        }, {
            title: '仓位数量',
            dataIndex: 'quantity',
        }, {
            title: '价值',
            dataIndex: 'price',
        }, {
            title: '开仓价',
            dataIndex: 'openPrice',
        }, {
            title: '标记价',
            dataIndex: 'tagPrice',
        }, {
            title: '强平价',
            dataIndex: 'forceClosePrice',
        }, {
            title: '保证金',
            dataIndex: 'bond'
        }, {
            title: '未实现盈亏',
            dataIndex: 'unrealizedPAL'
        }, {
            title: '已实现盈亏',
            dataIndex: 'realizedPAL'
        }];

        return (
            <Tabs>
                <TabPane tab="委托单" key="1">
                    <Table dataSource={this.props.entrusts} columns={columns} pagination={false} scroll={{y:60}} size="small"/>
                </TabPane>
                <TabPane tab="持仓单" key="2">
                    <Table columns={columns} pagination={false} size="small"/>
                </TabPane>
            </Tabs>
        );

    }

}