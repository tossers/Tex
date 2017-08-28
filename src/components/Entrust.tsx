import * as React from 'react';
import './Entrust.css';
import {Row, Col, notification, Spin, Form, InputNumber, Button, Slider} from 'antd';

const FormItem = Form.Item;


export class Entrust extends React.Component<{ entrust: (type: string,lever:number, price: number, quantity: number) => Promise<void> }, { spinning: boolean, price: number, quantity: number, lever: number }> {

    state = {
        spinning: false,
        price: 0,
        quantity: 0,
        lever: 1,

    };

    entrust(type: string) {
        this.setState({
            spinning: true
        });
        this.props.entrust(type, this.state.price, this.state.lever ,this.state.quantity).then(() => {
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
        });
    }

    render() {
        // const marks = {
        //     1: <span>x1</span>,
        //     5: <span>x5</span>,
        //     10: <span>x10</span>,
        //     25: <span>x25</span>,
        //     50: <span>x50</span>,
        //     100: <span>x100</span>,
        // };

        const formItemLayout = {
            labelCol: {
                sm: {span: 6},
            },
            wrapperCol: {
                sm: {span: 16},
            },
        };
        return (
            <Spin spinning={this.state.spinning} tip="下单中">
                <div onMouseDown={(e) => e.stopPropagation()} className="entrust">
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="仓位">
                            <InputNumber defaultValue={this.state.quantity} min={0} precision={3}
                                         formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                         onChange={(value) => {
                                             this.setState({quantity: Number(value)});
                                         }}/>
                        </FormItem>
                        <FormItem
                            style={{marginBottom: '0'}}
                            {...formItemLayout}
                            label="价格">
                            <InputNumber formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                         defaultValue={this.state.price} min={0} precision={3} onChange={(value) => {
                                this.setState({price: Number(value)});
                            }}/>
                        </FormItem>
                        <FormItem style={{marginBottom: '0'}}>
                            <Row>
                                <Col style={{paddingRight: '4px', textAlign: 'right'}} span={6}>
                                    <span>杠杆：</span>
                                </Col>
                                <Col span={12}>
                                    <Slider
                                        min={1}
                                        step={1}
                                        max={100}
                                        tipFormatter={(value) => 'x'+value}
                                        onChange={(value) => (this.setState({lever: Number(value)}))} value={this.state.lever}
                                    />
                                </Col>
                                <Col span={5}>
                                    <InputNumber
                                        min={1}
                                        max={100}
                                        style={{ marginLeft: 5 }}
                                        formatter={(value) => 'x'+value}
                                        value={this.state.lever}
                                        onChange={(value) => this.setState({lever: Number(value)})}
                                    />
                                </Col>
                            </Row>
                        </FormItem>
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