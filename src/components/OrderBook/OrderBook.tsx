/**
 * Created by YCY on 2017/8/24.
 */
import * as React from 'react';
import {OrderBookTable, OrderBookTableModel} from './OrderBookTable';

export class OrderBook extends React.Component<{
        sellData: OrderBookTableModel[],
        buyData: OrderBookTableModel[],
        height: number      //自适应高度
    }> {
    render() {
        let {sellData, buyData, height} = this.props;
        let len = sellData.length;
        //通过拖拽组件的高度来决定展示数据条数，因为标题表格头等原因，height要减3才最好的自适应（量过=。=）
        //例如height为5时就可以各显示2条数据（height的最小值为5,保险起见还是加个判断）
        if (height > 2) {
            height = height - 3;
        }
        //buy从头部开始截取，sell从尾部开始截取
        buyData = buyData.slice(0, height);
        sellData.splice(0, len-height);

        return (
            <div>
                <div style={{marginTop: '5px'}}>
                    <h3 style={{color: '#3e8654'}}>SELL:</h3>
                    <OrderBookTable showHeader={true} dataSource={sellData}/>
                </div>
                <div style={{marginTop: '15px'}}>
                    <h3 style={{color: '#ae543b'}}>BUY:</h3>
                    <OrderBookTable showHeader={false} dataSource={buyData}/>
                </div>
            </div>
        );
    }
}