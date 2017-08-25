import {action, observable} from 'mobx';


export class Chart {
    @observable
    chartData: {}[] = [];

    @action
    getMinLine = (data) => {
        let chartData = this.chartData.slice(0)
        const {price, time} = data
        chartData.push({close: price, date: new Date(time)})
        this.chartData = chartData
    }
}

export default new Chart();