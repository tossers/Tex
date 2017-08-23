import * as React from 'react';
import './Entrust.css';
import {notification, Spin, Form, InputNumber, Button} from 'antd';

const FormItem = Form.Item;

export class Entrust extends React.Component<{ entrust: (type: string, price: number, quantity: number) => Promise<void> }, { spinning: boolean, price: number, quantity: number }> {

    state = {
        spinning: false,
        price: 0,
        quantity: 0
    };

    entrust(type: string) {
        this.setState({
            spinning: true
        });
        this.props.entrust(type, this.state.price, this.state.quantity).then(() => {
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
                                         formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="价格">
                            <InputNumber formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                         defaultValue={this.state.price} min={0} precision={3}/>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" size="large" onClick={(e) => {
                                this.entrust('buy');
                            }}>买入</Button>
                            <Button type="danger" size="large" onClick={(e) => {
                                this.entrust('sell');
                            }}>卖出</Button>
                        </FormItem>
                    </Form>
                </div>
            </Spin>
        );

    }

}