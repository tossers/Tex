/**
 * Created by YCY on 2017/8/24.
 */
import * as React from 'react';
import {OrderBookTable, OrderBookTableModel} from './OrderBookTable';
export {OrderBookTableModel};
export interface Props{
    sellData: OrderBookTableModel[];
    buyData: OrderBookTableModel[];
    height: number;                 //自适应高度
}

export class OrderBook extends React.Component<Props| {}> {
    render() {
        let {sellData, buyData, height} = this.props as Props;

        //两数组长度不一样时的偏差值
        let sellOffset = 0;
        let sellLen = sellData.length;
        let buyOffset = 0;
        let buyLen = buyData.length;
        //通过拖拽组件的高度来决定展示数据条数，因为标题表格头等原因，height要减3才最好的自适应（量过=。=）
        //例如height为5时就可以各显示2条数据（height的最小值为5,保险起见还是加个判断）
        if (height > 2) {
            height = height - 3;
        }
        if(sellLen < height){
            buyOffset = height - sellLen;
        }
        if(buyLen < height){
            sellOffset = height - buyLen;
        }
        //buy从头部开始截取，sell从尾部开始截取
        //如果 start 为负，将它作为 length + start处理，此处 length 为数组的长度。
        buyData = buyData.slice(0,  height + buyOffset);
        sellData = sellData.slice(-height+sellOffset, sellLen);
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