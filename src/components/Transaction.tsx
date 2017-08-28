import {Table} from 'antd';
import * as React from 'react';
// import './Transaction.css'
export interface RecentTrade{
    price: number;
    quantity: number;
    time: string;
    key: number;
    direction: string;
}

export class Transaction extends React.Component<{dataSource: RecentTrade[]}>{

    columnsRender = (text, record,) =>
        (<span style={{color:  record.direction  === 'SELL' ?'#3e8654': '#ae543b'}}>{text}</span>)

    render() {
        const columns = [{
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: '30%',
            render: this.columnsRender,

        },{
            title: '交易量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '30%',
            render: this.columnsRender,
        },{
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            width: '30%',
            render: this.columnsRender,
        }, {
            title: '方向',
            dataIndex: 'direction',
            key: 'direction',
            width: '10%',
            render: (text, record, index) =>
                record.direction  === 'SELL' ?
                    <span style={{color: '#3e8654'}}>S</span>
                    :
                    <span style={{color: '#ae543b'}}>B</span>
        }]

        return (
            <div id="Ttable">
            <Table
                showHeader={false}
                columns={columns}
                pagination={false}
                dataSource={this.props.dataSource}
                scroll={{ y: 300 }}
                size="small"
                bordered={true}/>
            </div>
        );
    }

}