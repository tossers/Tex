import {Tabs, Table, Popconfirm, notification,Spin} from 'antd';
import * as React from 'react';
const TabPane = Tabs.TabPane;

export interface PositionTableModel{
    key:number;
    averagePrice: number;  //均价
    cost: number;          //成本
    id: number;            //持仓id
    position: number;      //持仓数量
    productId: number;     //产品id
    status: number;        //持仓状态，1为可用
    userAssetsId: number;  //用户资金id
}

export class Position extends React.Component<{
    deletePosition:(id: number) => Promise<void>;                   //平仓操作
    positionDataSource: Array<PositionTableModel>;                  //持仓列表
    entrusts: { id: number, price: number; quantity: number }[];    //委托列表
    onDeleteEntrust: (entrustId: number) => Promise<void>;          //撤单操作
    onUpdate:()=>void;                                              //撤单后更新委托列表
}, {spinning:boolean}> {

    state = {
        spinning: false
    };

    //平仓操作
    onDeletePosition(record: { id: number, position: number }){
        this.setState({
            spinning: true
        });
        this.props.deletePosition(record.id).then(() => {
            notification.success({
                message: '平仓请求已提交',
                description: `仓位数量:${record.position} 平仓请求已提交`
            });
        }).catch((ex) => {
            notification.error({
                message: '平仓请求提交失败',
                description: ex.message
            });
        }).then(()=>{
            this.setState({
                spinning: false
            });
        });
    }

    //撤单操作
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
        //持仓列表column
        const positionCol = [{
            title: '持仓ID',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '产品ID',
            dataIndex: 'productId',
            key: 'productId',
        },{
            title: '用户资金ID',
            dataIndex: 'userAssetsId',
            key: 'userAssetsId',
        },{
            title: '仓位数量',
            dataIndex: 'position',
            key: 'position',
        },{
            title: '均价',
            dataIndex: 'averagePrice',
            key: 'averagePrice',
        },{
            title: '成本',
            dataIndex: 'cost',
            key: 'cost',
        },{
            title: '持仓状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => text === 1 ? <span>可用</span>: <span>不可用</span>,
        },{
            title: '操作',
            dataIndex: 'operation',
            render: (text, record, index) => {
                return (record.position !== 0 ? (
                    <Popconfirm title={`你确定要平仓?仓位数量:${record.position}`} onConfirm={() => {
                        this.onDeletePosition(record);
                    }}><a href="#">平仓</a></Popconfirm>
                ) : null);
            }
        }];

        //委托列表column
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

        const {entrusts, positionDataSource} = this.props;
        return (
            <Spin spinning={this.state.spinning}>
                <Tabs>
                    <TabPane tab="委托单" key="1">
                        <Table
                            dataSource={entrusts}
                            columns={columns}
                            pagination={false}
                            size="small"
                        />
                    </TabPane>
                    <TabPane tab="持仓单" key="2">
                        <Table
                            columns={positionCol}
                            dataSource={positionDataSource}
                            pagination={false}
                            size="small"
                        />
                    </TabPane>
                </Tabs>
            </Spin>
        );

    }

}