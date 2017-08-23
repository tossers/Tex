import * as React from 'react';
import './Entrust.css';
import {notification, Spin, Form, InputNumber, Button} from 'antd';

const FormItem = Form.Item;

export class Entrust extends React.Component<{ entrust: (type: string, price: number, quantity: number) => Promise<void> }, { spinning: boolean }> {

    state = {
        spinning: false
    };

    entrust(type: string) {
        this.setState({
            spinning: true
        });
        const price = Number((this.refs.price as HTMLInputElement).value);
        const quantity = Number((this.refs.quantity as HTMLInputElement).value)
        this.props.entrust(type, price, quantity).then(() => {
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
                            <InputNumber defaultValue={0} min={0} precision={3}
                                         formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="价格">
                            <InputNumber formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                         defaultValue={0} min={0} precision={3}/>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" size="large">买入</Button>
                            <Button type="danger" size="large">卖出</Button>
                        </FormItem>
                    </Form>
                </div>
                {/*'"ghost" | "primary" | "dashed" | "danger" | undefined'*/}
                {/*<div className="entrust">*/}
                {/*<div className="item">*/}
                {/*<span>价格</span><input type="number" ref={'price'} onMouseDown={(e) => e.stopPropagation()}*/}
                {/*onMouseMove={(e) => e.stopPropagation()}/>*/}
                {/*</div>*/}
                {/*<div className="item">*/}
                {/*<span>仓位</span><input type="number" ref={'quantity'} onMouseDown={(e) => e.stopPropagation()}*/}
                {/*onMouseMove={(e) => e.stopPropagation()}/>*/}
                {/*</div>*/}
                {/*<div className="item">*/}
                {/*<button onClick={(e) => {*/}
                {/*this.entrust('buy');*/}
                {/*e.stopPropagation();*/}
                {/*}} onMouseDown={(e) => e.stopPropagation()}>买入*/}
                {/*</button>*/}
                {/*<button onClick={(e) => {*/}
                {/*this.entrust('sell');*/}
                {/*e.stopPropagation();*/}
                {/*}} onMouseDown={(e) => e.stopPropagation()}>卖出*/}
                {/*</button>*/}
                {/*</div>*/}
                {/*</div>*/}
            </Spin>
        );

    }

}