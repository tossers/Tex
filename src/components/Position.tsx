import {Tabs, Table, Popconfirm, notification,Spin} from 'antd';
import * as React from 'react';

const TabPane = Tabs.TabPane;

export class Position extends React.Component<{
    entrusts: { id: number, price: number; quantity: number }[],
    onDeleteEntrust: (entrustId: number) => Promise<void>,
    onUpdate:()=>void
}, {spinning:boolean}> {

    state = {
        spinning: false
    };

    onDelete(record: { id: number },index:number) {
        this.setState({
            spinning: true
        });
        this.props.onDeleteEntrust(record.id).then(() => {
            notification.success({
                message: '撤单请求已提交',
                description: `订单号:${record.id} 撤单请求已提交`
            });
        }).catch((ex) => {
            notification.error({
                message: '撤单请求提交失败',
                description: ex.message
            });
        }).then(()=>{
            this.props.onUpdate();
            this.setState({
                spinning: false
            });
        });
    }

    render() {

        const columns = [{
            title: '订单ID',
            dataIndex: 'id',
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
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return (this.props.entrusts.length > 0 ? (
                    <Popconfirm title={`你确定要撤单?订单号:${record.id}`} onConfirm={() => {
                        this.onDelete(record,index);
                    }}><a href="#">撤单</a></Popconfirm>
                ) : null);
            }
        }];

        return (
            <Spin spinning={this.state.spinning}>
                <Tabs>
                    <TabPane tab="委托单" key="1">
                        <Table dataSource={this.props.entrusts} columns={columns} pagination={false} size="small"/>
                    </TabPane>
                    <TabPane tab="持仓单" key="2">
                        <Table columns={columns} pagination={false} size="small"/>
                    </TabPane>
                </Tabs>
            </Spin>
        );

    }

}