import * as React from 'react';
import {Table} from 'antd';
// import './BuyTable.css'

export class BuyTable extends React.Component<{
    dataSource: {
        key: [number, string];
        price: number;
        quantity: number;
        total: number;
        type: string;
    }[], showHeader: boolean
}> {

    render() {
        let {dataSource, showHeader} = this.props;
        const columns = [{
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: '33.33%',
            render: (text, record, index) =>
                (
                    <span style={{
                        fontWeight: 'bold',
                        color: record.type === 'buy' ? '#ae543b' : '#3e8654'
                    }}>{text}</span>
                )
        }, {
            title: '数量',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '33.33%',
        },
        //     {
        //     title: '总数',
        //     dataIndex: 'total',
        //     key: 'total',
        //     width: '33.33%',
        // }
        ];

        return (
            <Table
                dataSource={dataSource}
                showHeader={showHeader}
                bordered={true}
                pagination={false}
                columns={columns}
            />
        );
    }
}