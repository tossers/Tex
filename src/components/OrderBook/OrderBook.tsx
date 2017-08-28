/**
 * Created by YCY on 2017/8/24.
 */
import * as React from 'react';
import {BuyTable} from './BuyTable';
// import {Icon} from 'antd'
// import './OrderBook.css'

interface OneOrder{
    key: [number, string];
    price:number;
    quantity:number;
    total:number;
    type:string;
}

export class OrderBook extends React.Component<{sellData: OneOrder[], buyData: OneOrder[]}> {

    render() {
        const {sellData, buyData} = this.props
        return (
            <div id="orderBook">
                <div id="sellTable">
                    <h3 style={{color: '#3e8654'}}>SELL:</h3>
                    <BuyTable showHeader={true} dataSource={sellData}/>
                </div>
                <div id="buyTable">
                    <h3 style={{color: '#ae543b'}}>BUY:</h3>
                    <BuyTable showHeader={false} dataSource={buyData}/>
                </div>

                {/*<div className="betweenTables">*/}
                    {/*<h2>4295.7<Icon style={{marginLeft: '2px'}} type="caret-down" /></h2>*/}
                    {/*<div>*/}
                        {/*<a>*/}
                            {/*<span className="indicatorPrice tooltipWrapper">*/}
                                {/*<Icon style={{marginRight: '2px'}} type="export" />4316.07*/}
                            {/*</span>*/}
                        {/*</a>*/}
                        {/*<span> / </span>*/}
                        {/*<a>*/}
                            {/*<span className="tooltipWrapper">4311.17</span>*/}
                        {/*</a>*/}
                        {/*<span className="ant-divider" />*/}
                        {/*<a>*/}
                            {/*<span className="leverageLight tooltipWrapper"/>*/}
                            {/*<span className="leverageLight tooltipWrapper"/>*/}
                            {/*<span className="leverageLight tooltipWrapper"/>*/}
                            {/*<span className="leverageLight tooltipWrapper"/>*/}
                            {/*<span className="leverageLight tooltipWrapper"/>*/}
                        {/*</a>*/}
                    {/*</div>*/}
                {/*</div>*/}
            </div>
        );
    }
}