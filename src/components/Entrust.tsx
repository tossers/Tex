import * as React from 'react';
import './Entrust.css';
import {Row, Col, notification, Spin, Form, InputNumber, Button, Slider} from 'antd';

const FormItem = Form.Item;

export class Entrust extends React.Component<{
    availableassets: number         //用户资金
    lastPrice: number,              //最新价格
    onUpdate: ()=> void,
    entrust: (type: string, price: number, quantity: number, lever:number,) => Promise<void> },
    { spinning: boolean, price: number, quantity: number, lever: number}> {

    state = {
        spinning: false,
        price: 1,
        quantity: 1,
        lever: 1,
        rate: 0.01,
    };

    // timer;

    componentWillReceiveProps(props: {lastPrice: number}){
        if(this.props.lastPrice !== props.lastPrice){
            this.setState({price: props.lastPrice});
        }
    }

    entrust(type: string) {
        this.setState({
            spinning: true
        });
        this.props.entrust(type, this.state.price, this.state.quantity, this.state.lever).then(() => {
            notification.success({
                message: '下单成功',
                description: '下单成功'
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
            this.props.onUpdate();
        });
    }

    updatePrice = (price: number) => {
        this.setState({price});
    }

    updateQuntity = (quantity: number)=>{
        this.setState({quantity});
    }

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
        let {quantity, price, lever, spinning} = this.state;
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
                            <InputNumber formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                         value={price} step={0.001} min={0} precision={3} onChange={this.updatePrice}/>
                        </FormItem>

                            <Row>
                                <Col style={{paddingRight: '4px', textAlign: 'right', lineHeight: '2.5'}} span={6}>
                                    <span>杠杆：</span>
                                </Col>
                                <Col span={11}>
                                    <Slider
                                        min={1}
                                        step={1}
                                        max={100}
                                        tipFormatter={(value) => 'x'+value}
                                        value={lever}
                                        onChange={(value) => (this.setState({lever: Number(value)}))}
                                    />
                                </Col>
                                <Col span={5}>
                                    <InputNumber
                                        min={1}
                                        max={100}
                                        formatter={(value) => 'x'+value}
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