import {Table, Icon} from 'antd';
import * as React from 'react';
// import './Transaction.css'
export class Transaction extends React.Component<{dataSource}>{

    render() {
        // const data: { key: number, price: number, quantity: number, time: string, direction: string }[] = [];
        // for (let i = 0; i < 100; i++) {
        //     data.push({
        //         key: i,
        //         price: i,
        //         quantity: i,
        //         time: new Date().toLocaleTimeString(),
        //         direction: 'B'
        //     });
        // }

        const columns = [{
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: '30%',
            render: (text, record, index) =>
                <span style={{color:  record.action  === 'SELL' ?'#ae543b': '#3e8654'}}>
            <Icon style={{lineHeight: '0'}} type="arrow-down" />{text}</span>
        },{
            title: '交易量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '30%',
            render: (text, record, index) =>
                <span style={{color:  record.action  === 'SELL' ?'#ae543b': '#3e8654'}}>{text}</span>
        },{
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            width: '30%',
            render: (text, record, index) =>
                <span style={{color:  record.action  === 'SELL' ?'#ae543b': '#3e8654'}}>{text}</span>
        }, {
            title: '方向',
            dataIndex: 'direction',
            key: 'direction',
            width: '10%',
            render: (text, record, index) =>
                record.action  === 'SELL' ?
                    <span style={{color: '#ae543b'}}>S</span>
                    :
                    <span style={{color: '#3e8654'}}>B</span>
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