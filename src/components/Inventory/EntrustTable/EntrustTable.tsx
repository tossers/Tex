import React from 'react';
import {Table, Popconfirm, notification, Tooltip} from 'antd';
import {toFixed} from '../../../util/index';
import {timeFormat} from 'd3-time-format';
import {ProductModel} from '../../Product';
//委托单表格DataSource
export interface EntrustTableModel{
    key: number;
    productId: number;        //产品id
    price: number;            //委托价格
    quantity: number;         //数量
    lever: number;            //杠杆
    type: number;             //订单方向（必传）----> BUY,SELL,SHORT,COVER分别用1,2,3,4表示
    bond: number;             //下单保证金 可不传
    residue: number;          //剩余仓位 如果剩余仓位为0,表示该订单已完全成交
    createdAt: number;        //订单时间（非必传）
    action: number;           //订单类型----> 1 下单 2 撤单 -1 平仓(非必传)
    orderId: number;          //订单id
}

export interface Props{
    loading: boolean;
    productList: ProductModel[];
    dataSource: EntrustTableModel[];
    total: number;
    height: number;                                           //自适应高度
    onDeleteEntrust: (entrustId: number) => Promise<void>;    //撤单操作
    updateEntrustList:() => void;                             //撤单后更新委托列表
    getEntrustList: (currentPage: number) => void;            //获取委托列表
}

export class EntrustTable extends React.Component<Props| {}>{

    componentWillMount(){
        const {getEntrustList} = this.props as Props;
        getEntrustList(1);
    }

    /**
     * 撤单处理
     * @param record
     */
    onDelete(record: { orderId: number }) {
        const {onDeleteEntrust, updateEntrustList} = this.props as Props;
        onDeleteEntrust(record.orderId)
            .then(() =>
                notification.success({
                    message: '撤单',
                    description: `撤单请求已提交`
                })
            )
            .catch((ex) =>
                notification.error({
                    message: '撤单请求提交失败',
                    description: ex.message
                })
            )
            .then(() => updateEntrustList());
    }

    render() {
        //委托列表column
        const columns = [{
            title: '产品ID',
            dataIndex: 'productId',
            key: 'productId',
            width: '10%',
            render: (text) => {
                const {productList} = this.props as Props;
                let temp = productList.find((i)=>i.id === text);
                return temp? temp.name:　text;
            }
        }, {
            title: '委托价格',
            dataIndex: 'price',
            key: 'price',
            width: '10%',
            render: (text) => (toFixed(text, 3)),
        }, {
            title: '仓位数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '10%',
            render: (text) => (toFixed(text, 3)),
        }, {
            title: '杠杆倍数',
            dataIndex: 'lever',
            key: 'lever',
            width: '10%',
        }, {
            title: '订单方向',
            dataIndex: 'type',
            key: 'type',
            width: '10%',
            render:(text) => {
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
            title: '下单保证金',
            dataIndex: 'bond',
            key: 'bond',
            width: '10%',
            render: (text) => (toFixed(text, 3)),
        }, {
            title: '剩余仓位',
            dataIndex: 'residue',
            key: 'residue',
            width: '10%',
            render: (text) => (toFixed(text, 3)),
        }, {
            title: '订单时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '10%',
            render: (text) =>
                (
                    <Tooltip placement="right" title={timeFormat('%H:%M:%S')(new Date(text))}>
                        <span>{new Date(text).toLocaleDateString()}</span>
                    </Tooltip>
                )
        }, {
            title: '订单类型',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render:(text) => {
                //1 下单 2 撤单 3 平仓(非必传)
                let temp = text;
                switch(text){
                    case 1: temp = <span>下单</span>;   break;
                    case 2: temp = <span>撤单</span>;   break;
                    case -1: temp = <span>平仓</span>;  break;
                    default: break;
                }
                return temp;
            }
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
            render: (text, record) => (
                    <Popconfirm title={`你确定要撤单?`} onConfirm={() => {
                        this.onDelete(record);
                    }}><a href="#">撤单</a></Popconfirm>
            )
        }];

        const {dataSource, height, loading, total, getEntrustList} = this.props as Props;
        return (
            <Table
                loading={loading}
                dataSource={dataSource}
                columns={columns}
                pagination={total < 100 ? false : {total, onChange: () => getEntrustList, pageSize: 100}}
                size="small"
                scroll={{y: height * 62 - 150}}
            />
        );
    }
}