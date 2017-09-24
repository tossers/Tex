import * as React from 'react';
import './Entrust.css';
import {Row, Col, notification, Spin, Form, InputNumber, Button, Slider} from 'antd';
// import {toFixed} from '../util';
const FormItem = Form.Item;

export interface Props{
    availableassets: number;         //用户资金
    lastPrice: number;               //最新价格
    updateEntrustList: () => void;   //刷新委托列表
    getUserAssets: () => void;       //刷新资金账户
    stopOrder: (productId: number, stopLoss: number, stopProfit: number) => Promise<void>;  //设置止盈止损
    product: {id: number};
    entrust: (type: string, productId: string, price: number, quantity: number, lever: number) => Promise<void>;
}

export class Entrust extends React.Component< Props| {}, {
        spinning: boolean,
        price: number,
        quantity: number,
        lever: number,
        stopLoss: number,
        stopProfit: number,
    }> {

    state = {
        spinning: false,
        price: 1,
        quantity: 1,
        lever: 0,
        rate: 0.01,
        stopLoss: 0,
        stopProfit: 0,
    };

    componentWillReceiveProps(props: {lastPrice: number}){
        const {lastPrice} = this.props as Props;
        if(lastPrice !== props.lastPrice){
            this.setState({price: props.lastPrice/ 1000});
        }
    }

    entrust(type: string) {
        const {entrust, product, updateEntrustList, getUserAssets, /*stopOrder, stopLoss, stopProfit*/} = this.props as Props;
        const {price, quantity, lever} = this.state;
        this.setState({
            spinning: true
        });
        // stopOrder(product.id, stopLoss, stopProfit).then(() => {});
        entrust(type, product.id.toString(), price, quantity, lever).then(() => {
            notification.success({
                message: '下单成功',
                description: '下单成功',
            });
        }).catch((ex) => {
            notification.error({
                message: '下单失败',
                description: ex.message,
            });
        }).then(() => {
            this.setState({
                spinning: false
            });
        }).then(()=>{
            updateEntrustList();
            getUserAssets();
        });
    }

    updatePrice = (price: number) => {
        this.setState({price});
    };

    updateQuntity = (quantity: number)=>{
        this.setState({quantity});
    };

    updateStopProfit = (stopProfit: number)=>{
        this.setState({stopProfit});
    };

    updateStopLoss = (stopLoss: number)=>{
        this.setState({stopLoss});
    };

    // handleRateChange = (rate) => {
    //     if(this.timer){
    //         clearTimeout(this.timer);
    //     }
    //
    //     this.timer = setTimeout(() => {
    //         const {availableassets} = this.props;
    //         const {price, lever} = this.state;
    //         let quantity = rate * availableassets * lever / price / 100;
    //         this.setState({quantity});
    //     }, 500);
    // }

    render() {
        const formItemLayout = {
            labelCol: {
                sm: {span: 6},
                xs: {span: 6},
            },
            wrapperCol: {
                sm: {span: 16},
                xs: {span: 16},
            },
        };
        // const {availableassets} = this.props;
        let {quantity, price, lever, spinning, /*stopLoss, stopProfit*/} = this.state;
        // const rate = quantity * price / lever / availableassets * 100;
        return (
            <Spin spinning={spinning} tip="下单中">
                <div onMouseDown={(e) => e.stopPropagation()} className="entrust">
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="仓位">
                            <InputNumber value={quantity} min={0} precision={3}
                                         formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                         step={0.001}
                                         onChange={this.updateQuntity}/>
                        </FormItem>
                        {/*<Row style={{marginBottom: '10px'}}>*/}
                            {/*<Col style={{paddingRight: '4px', textAlign: 'right', lineHeight: '2.5'}} span={6}>*/}
                                {/*<span>比率：</span>*/}
                            {/*</Col>*/}
                            {/*<Col span={11}>*/}
                                {/*<Slider*/}
                                    {/*min={0.01}*/}
                                    {/*step={0.01}*/}
                                    {/*max={100}*/}
                                    {/*tipFormatter={(value) => Number(value).toFixed(2) + '%'}*/}
                                    {/*value={rate}*/}
                                    {/*onChange={(value)=>{*/}
                                        {/*this.setState({*/}
                                            {/*quantity:((Number(value)/100) * availableassets) * lever*/}
                                        {/*});*/}
                                    {/*}}*/}
                                {/*/>*/}
                            {/*</Col>*/}
                            {/*<Col span={5}>*/}
                                {/*<InputNumber*/}
                                    {/*min={0.01}*/}
                                    {/*max={100}*/}
                                    {/*formatter={(value) =>  Number(value).toFixed(2) +'%'}*/}
                                    {/*value={rate}*/}
                                    {/*onChange={(value)=>{*/}
                                        {/*this.setState({*/}
                                            {/*quantity:((Number(value)/100) * availableassets) * lever*/}
                                        {/*});*/}
                                    {/*}}*/}
                                {/*/>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                        <FormItem
                            style={{marginBottom: '0'}}
                            {...formItemLayout}
                            label="价格">
                            <InputNumber
                                value={price}
                                step={0.001}
                                min={0}
                                precision={3}
                                onChange={this.updatePrice}
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </FormItem>
                        {/*<FormItem*/}
                            {/*style={{marginBottom: '0'}}*/}
                            {/*{...formItemLayout}*/}
                            {/*label="止盈">*/}
                            {/*<InputNumber*/}
                                {/*value={stopProfit}*/}
                                {/*step={0.001}*/}
                                {/*min={0}*/}
                                {/*precision={3}*/}
                                {/*onChange={this.updateStopProfit}*/}
                                {/*formatter={value => value === 0 || value === '0'? '不设置': `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                            {/*/>*/}
                        {/*</FormItem>*/}
                        {/*<FormItem*/}
                            {/*style={{marginBottom: '0'}}*/}
                            {/*{...formItemLayout}*/}
                            {/*label="止损">*/}
                            {/*<InputNumber*/}
                                {/*value={stopLoss}*/}
                                {/*step={0.001}*/}
                                {/*min={0}*/}
                                {/*precision={3}*/}
                                {/*onChange={this.updateStopLoss}*/}
                                {/*formatter={value => value === 0 || value === '0'? '不设置': `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                            {/*/>*/}
                        {/*</FormItem>*/}

                            <Row>
                                <Col style={{paddingRight: '4px', textAlign: 'right', lineHeight: '2.5'}} span={6}>
                                    <span>杠杆：</span>
                                </Col>
                                <Col span={11}>
                                    <Slider
                                        min={0}
                                        step={1}
                                        max={100}
                                        tipFormatter={(value) => value === 0? '全仓': 'x'+value}
                                        value={lever}
                                        onChange={(value) => (this.setState({lever: Number(value)}))}
                                    />
                                </Col>
                                <Col span={5}>
                                        <InputNumber
                                            min={0}
                                            step={1}
                                            max={100}
                                            formatter={(value) => value === 0 || value === '0'? '全仓': 'x'+value}
                                            value={lever}
                                            onChange={(value) => this.setState({lever: Number(value)})}
                                        />
                                </Col>
                            </Row>
                        <FormItem>
                            <Button type="primary" onClick={(e) => {
                                this.entrust('buy');
                            }}>买入</Button>
                            <Button type="danger" onClick={(e) => {
                                this.entrust('sell');
                            }}>卖出</Button>
                        </FormItem>
                    </Form>
                </div>
            </Spin>
        );
    }
}