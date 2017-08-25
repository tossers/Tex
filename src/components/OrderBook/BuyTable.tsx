import * as React from 'react'
import {Table} from 'antd'
// import './BuyTable.css'

export class BuyTable extends React.Component<{dataSource, showHeader}>{

    render(){
        const {dataSource, showHeader} = this.props
        const columns = [{
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: '33.33%',
            render: (text, record, index) =>
                <span style={{
                    fontWeight: 'bold',
                    color: record.key.indexOf('buy') >= 0 ? '#ae543b' : '#3e8654'
                }}>{text}</span>
        }, {
            title: '目前仓位数量',
            dataIndex: 'size',
            key: 'size',
            width: '33.33%',
        }, {
            title: '总数',
            dataIndex: 'total',
            key: 'total',
            width: '33.33%',
        }]

        return (
            <Table
                dataSource={dataSource}
                showHeader={showHeader}
                bordered
                pagination={false}
                columns={columns}
            />
        )
    }
}