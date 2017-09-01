import {Tabs, Table, Popconfirm, notification,Spin} from 'antd';
import * as React from 'react';
const TabPane = Tabs.TabPane;

//持仓表格DataSource
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

//委托单表格DataSource
export interface EntrustTableModel{
    key: number;
    stopLoss: number;      //止损价格
    stopProfit: number;    //止盈价格
    orderType: number;     //订单方向----> BUY,SELL,SHORT,COVER分别用1,2,3,4表示
    userAssetsId: number;  //用户资金id
    price: number;         //委托价格
    productId: number;     //产品id
    lever: number;         //杠杆倍数
    quantity: number;      //数量
    orderMethod: number;   //订单类型----> 1 下单 2 撤单 3 平仓(非必传)
    turnover: number;      //成交额
    id: number;            //订单id
    status: number;        //订单状态，1为可用
    createdTime: string;   //订单时间
}

export class Position extends React.Component<{
    deletePosition:(id: number) => Promise<void>;                   //平仓操作
    positionsDataSource: Array<PositionTableModel>;                 //持仓列表
    entrusts: Array<EntrustTableModel>;                             //委托列表
    onDeleteEntrust: (entrustId: number) => Promise<void>;          //撤单操作
    onUpdate:() => Promise<void>;                                   //撤单后更新委托列表
    height: number                                                  //表格max-height
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
            this.setState({
                spinning: false
            });
        }).then(() =>
            this.props.onUpdate()
        );
    }

    //保留3三位小数
    colRender = (text) => <span>{(text)? text.toFixed(3) : 0}</span>

    render() {
        //持仓列表column
        const positionCol = [{
            title: '持仓ID',
            dataIndex: 'id',
            key: 'id',
            width: '12.5%',
        }, {
            title: '产品ID',
            dataIndex: 'productId',
            key: 'productId',
            width: '12.5%',
        },{
            title: '用户资金ID',
            dataIndex: 'userAssetsId',
            key: 'userAssetsId',
            width: '12.5%',
        },{
            title: '仓位数量',
            dataIndex: 'position',
            key: 'position',
            width: '12.5%',
            render: this.colRender,
        },{
            title: '均价',
            dataIndex: 'averagePrice',
            key: 'averagePrice',
            width: '12.5%',
            render: this.colRender,
        },{
            title: '成本',
            dataIndex: 'cost',
            key: 'cost',
            width: '12.5%',
            render: this.colRender,
        },{
            title: '持仓状态',
            dataIndex: 'status',
            key: 'status',
            width: '12.5%',
            render: (text) => text === 1 ? <span>可用</span>: <span>平仓中</span>,
        },{
            title: '操作',
            dataIndex: 'operation',
            width: '12.5%',
            render: (text, record, index) => {
                return (record.status === 1 ? (
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
            key: 'id',
            width: '7%',
        }, {
            title: '产品ID',
            dataIndex: 'productId',
            key: 'productId',
            width: '7%',
        }, {
            title: '用户资金ID',
            dataIndex: 'userAssetsId',
            key: 'userAssetsId',
            width: '8%',
        }, {
            title: '仓位数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '7%',
            render: this.colRender,
        },
        //     {
        //     title: '委托价格',
        //     dataIndex: 'price',
        //     key: 'price',
        //     width: '7%',
        //     render: this.colRender,
        // },
            {
            title: '杠杆倍数',
            dataIndex: 'lever',
            key: 'lever',
            width: '7%',
        }, {
            title: '成交额',
            dataIndex: 'turnover',
            key: 'turnover',
            width: '7%',
            render: this.colRender,
        }, {
            title: '止损价格',
            dataIndex: 'stopLoss',
            key: 'stopLoss',
            width: '7%',
            render: this.colRender,
        }, {
            title: '止盈价格',
            dataIndex: 'stopProfit',
            key: 'stopProfit',
            width: '7%',
            render: this.colRender,
        }, {
            title: '订单方向',
            dataIndex: 'orderType',
            key: 'orderType',
            width: '7%',
            render:(text, record, index) => {
                //BUY,SELL,SHORT,COVER分别用1,2,3,4表示
                let temp = text;
                switch(text){
                    case 1: temp = <span>BUY</span>;   break;
                    case 2: temp = <span>SELL</span>;  break;
                    case 3: temp = <span>SHORT</span>; break;
                    case 4: temp = <span>COVER</span>; break;
                    default: break;
                }
                return temp;
            }
        }, {
            title: '订单类型',
            dataIndex: 'orderMethod',
            key: 'orderMethod',
            width: '7%',
            render:(text, record, index) => {
                //1 下单 2 撤单 3 平仓(非必传)
                let temp = text;
                switch(text){
                    case 1: temp = <span>下单</span>;   break;
                    case 2: temp = <span>撤单</span>;   break;
                    case 3: temp = <span>平仓</span>;   break;
                    default: break;
                }
                return temp;
            }
        }, {
            title: '订单状态',
            dataIndex: 'status',
            key: 'status',
            width: '7%',
            render: (text) => <span>{text === 1? '可用': '不可用'}</span>
        },{
            title: '创建时间',
            dataIndex: 'createdTime',
            key: 'createdTime',
            width: '7%',
            render: (text) => <span>{new Date(text).toLocaleDateString()}</span>
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '6%',
            render: (text, record, index) => {
                return (this.props.entrusts.length > 0 ? (
                    <Popconfirm title={`你确定要撤单?订单号:${record.id}`} onConfirm={() => {
                        this.onDelete(record,index);
                    }}><a href="#">撤单</a></Popconfirm>
                ) : null);
            }
        }];

        const {entrusts, positionsDataSource, height} = this.props;
        return (
            <Spin spinning={this.state.spinning}>
                <Tabs>
                    <TabPane tab="委托单" key="1">
                        <Table
                            dataSource={entrusts}
                            columns={columns}
                            pagination={false}
                            size="small"
                            scroll={{y: height * 62 - 150}}
                        />
                    </TabPane>
                    <TabPane tab="持仓单" key="2">
                        <Table
                            columns={positionCol}
                            dataSource={positionsDataSource}
                            pagination={false}
                            size="small"
                            scroll={{y: height * 62 - 150}}
                        />
                    </TabPane>
                </Tabs>
            </Spin>
        );

    }

}