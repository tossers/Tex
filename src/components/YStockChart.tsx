
import * as React from "react";
import { format } from "d3-format";
import { scaleTime } from "d3-scale";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import { AreaSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import {
    CrossHairCursor,
    MouseCoordinateX,
    EdgeIndicator,
    MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

let start = new Date();
start.setHours(0);
start.setMinutes(0);
start.setSeconds(0);
start.setMilliseconds(0);

const arrayMax = (x, y) => {
    if(x.close !== null && y.close !== null){
        return {close: Math.max(x.close, y.close)}
    }else{
        return {close: 0}
    }
}

// const arrayMin = (x, y) => {
//     if(x.close && y.close){
//         return {close: Math.min(x.close, y.close)}
//     }else{
//         return {close: 0}
//     }
// }

class AreaChart extends React.Component<{data, width, ratio}>{
    render() {
        const { data, width, ratio } = this.props;
        const type = 'svg'
        //数组长度为2时渲染图表
        if(data.length>1){
            //克隆数组
            let drawData = data.slice(0)
            //数组排序
            drawData.sort((a, b) => a.date - b.date)
            //设置数组头为当天的0时和数据前一分钟，且close都为null
            drawData.unshift({close: null, date: new Date(drawData[0].date.getTime() - 60000)})
            drawData.unshift({close: null, date: start})
            //x轴末端为数组最后一个数据的时间
            let end = drawData[drawData.length-1].date;
            //y轴的范围为0至数组最大值加30%
            let yMax = Math.floor(drawData.reduce(arrayMax).close * (1 + 0.3))
            return (
                <ChartCanvas ratio={ratio} width={width} height={450}
                             margin={{ left: 40, right: 50, top: 10, bottom: 30 }}
                             seriesName="MSFT"
                             data={drawData} type={type}
                             xAccessor={(d)=>{
                                 if(d) return d.date;
                             }}
                             xScale={scaleTime()}
                             mouseMoveEvent={true}
                             panEvent={true}
                             zoomEvent={true}
                             xExtents={[start, end]}>
                    <Chart id={0} yExtents={[0 ,yMax]}>
                        <XAxis axisAt="bottom" orient="bottom" ticks={6}/>
                        <YAxis axisAt="left" orient="left" />
                        <AreaSeries yAccessor={d => d.close}/>
                        <MouseCoordinateX
                            at="bottom"
                            orient="bottom"
                            displayFormat={timeFormat("%H:%M:%S")} />
                        <MouseCoordinateY
                            at="right"
                            orient="right"
                            displayFormat={format(".2f")} />
                        <EdgeIndicator itemType="last" orient="right" edgeAt="right" yAccessor={d => d.close}/>
                    </Chart>
                    <CrossHairCursor />
                </ChartCanvas>
            )
        }else{
            return <h1>暂无数据</h1>
        }
    }
}



export default fitWidth(AreaChart);
