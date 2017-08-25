/**
 * Created by YCY on 2017/8/24.
 */
import * as React from 'react'
import {BuyTable} from './BuyTable'
// import {Icon} from 'antd'
// import './OrderBook.css'

export class OrderBook extends React.Component<{sellData, buyData}> {

    render() {
        const {sellData, buyData} = this.props
        return (
            <div id="orderBook">
                <div id="buyTable">
                    <BuyTable showHeader={true} dataSource={buyData}/>
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

                <div id="sellTable">
                    <BuyTable showHeader={false} dataSource={sellData}/>
                </div>
            </div>
        )
    }
}