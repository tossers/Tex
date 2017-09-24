import React from 'react';
import {AdjustBond} from './AdjustBond';
import {AdjustLever} from './AdjustLever';
import {StopOrder} from '../../MyModal/StopOrder/StopOrder'
import {Table, Popconfirm, notification} from 'antd';
import {toFixed} from '../../../util';

//持仓表格DataSource
export interface PositionTableModel{
    key:number;
    id: number;               //id
    productId: number;        //产品id
    name: string;             //产品名字
    position: number;         //保证金
    bond: number;             //成本
    avgPrice: number;         //均价
    lever: number;            //杠杆倍数
    status: number;           //2为平仓中
}

export interface Props{
    loading: boolean;
    availableAssets: number;                                 //可用资金
    dataSource: PositionTableModel[];                        //产品列表
    height: number;                                          //自适应高度
    deletePosition: (entrustId: number) => Promise<void>;    //平仓操作
    getPositionList: () => void;                             //刷新持仓列表
    updateEntrustList: () => void;                           //刷新委托单
    getUserAssets: () => void;                               //刷新资金账户
    stopOrder: (productId: number, stopLoss: number, stopProfit: number) => Promise<void>;  //设置止盈止损
}

export class PositionTable extends React.Component<Props| {}, {}>{

    componentWillMount(){
       const {getPositionList} = this.props as Props;
       getPositionList();
    }

    /**
     * 平仓操作
     * @param record
     */
    onDeletePosition(record: { productId: number, position: number }){
        const {deletePosition, getPositionList} = this.props as Props;
        deletePosition(record.productId).then(() => {
            notification.success({
                message: '平仓请求已提交',
                description: `仓位数量:${record.position} 平仓请求已提交`
            });
        }).catch((ex) => {
            this.setState({loading: false});
            notification.error({
                message: '平仓请求提交失败',
                description: ex.message
            });
        }).then(()=>{
            getPositionList();
        });
    }

    render(){
        const len = 6;
        //持仓列表column
        const columns = [{
            title: '产品',
            dataIndex: 'name',
            key: 'name',
            width: 100/len + '%',
        }, {
            title: '仓位',
            dataIndex: 'position',
            key: 'position',
            width: 100/len + '%',
            render: (text) => (toFixed(text, 3)),
        },{
            title: '保证金',
            dataIndex: 'bond',
            key: 'bond',
            width: 100/len + '%',
            render: (text, record) => {
                const {getPositionList, getUserAssets, availableAssets} = this.props as Props;
                return (
                    <span>
                    <AdjustBond
                        getPositionList={getPositionList}
                        getUserAssets={getUserAssets}
                        position={record.position}
                        available={availableAssets}
                        productId={record.productId}
                        bond={record.bond}>
                        <a onClick={(e) => {
                            e.preventDefault();
                        }} href="#"><u>+$</u></a>
                    </AdjustBond>
                    <span style={{marginLeft: '3px'}}>{toFixed(text, 3)}</span>
                </span>
                );
            },
        },{
            title: '均价',
            dataIndex: 'avgPrice',
            key: 'avgPrice',
            width: 100/len + '%',
            render: (text) => (toFixed(text, 3)),
        },{
            title: '杠杆倍数',
            dataIndex: 'lever',
            key: 'lever',
            width: 100/len + '%',
        },{
            title: '操作',
            dataIndex: 'operation',
            width: 100/len + '%',
            render: (text, record) => {
                const {getPositionList, stopOrder} = this.props as Props;
                return (
                    <span>
                        <Popconfirm title={`你确定要平仓?仓位数量:${toFixed(record.position, 3)}`} onConfirm={() => {
                            this.onDeletePosition(record);}}>
                            <a href="#">{record.state === 2? '平仓中': '平仓'}</a>
                        </Popconfirm>
                        <span className="ant-divider" />
                        <AdjustLever
                            getPositionList={getPositionList}
                            productId={record.productId}>
                            <a onClick={(e) => {e.preventDefault();}} href="#">调整杠杆</a>
                        </AdjustLever>
                        <span className="ant-divider" />
                        <StopOrder
                            productId={record.productId}
                            avgPrice={record.avgPrice}
                            position={record.position}
                            stopOrder={stopOrder}>
                            <a onClick={(e) => {e.preventDefault();}} href="#">止盈止损</a>
                        </StopOrder>
                    </span>
                );
            }
        }];
        const {dataSource, height, loading} = this.props as Props;
        return (
            <Table
                loading={loading}
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                size="small"
                scroll={{y: height * 62 - 150}}
            />
        );
    }
}