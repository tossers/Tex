import {Table, Tooltip} from 'antd';
import * as React from 'react';
import {toFixed} from '../../util/index';
import { timeFormat } from 'd3-time-format';

export interface RecentTradeTableModel{
    price: number;
    quantity: number;
    time: number;
    key: number;
    direction: string;
}

export interface Props{
    dataSource: RecentTradeTableModel[];
    height: number;
}

export class Transaction extends React.Component<Props| {}>{

    columnsRender = (text, record,) =>
        (<span style={{color:  record.direction  === 'SELL' ?'#3e8654': '#ae543b'}}>{toFixed(text, 3)}</span>)

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
            render: (text, record) =>
                (
                    <Tooltip placement="left" title={new Date(text).toLocaleDateString()}>
                        <span style={{color:  record.direction  === 'SELL' ?'#3e8654': '#ae543b'}}>{timeFormat('%H:%M:%S')(new Date(text))}</span>
                    </Tooltip>
                )
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
        }];

        const {height, dataSource} = this.props as Props;
        return (
            <div id="transaction_table">
                <Table
                    showHeader={false}
                    columns={columns}
                    pagination={false}
                    dataSource={dataSource}
                    scroll={{y: height * 62 - 70}}
                    size="small"
                    bordered={true}/>
            </div>
        );
    }

}