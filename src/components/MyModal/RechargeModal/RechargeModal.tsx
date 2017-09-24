import * as React from 'react';
import {Button, InputNumber, Modal, notification, Form} from 'antd';
import {MyModal} from '../MyModal';
// import {Throttle} from '../../util/Throttle';
export interface Props{
    getUserAssets: () => void;
    recharge: (money: number) => Promise<string>;
}

export class RechargeModal extends React.Component< Props| {}, {
    value: number;
    visible: boolean;
    help: string;
    status: 'success'| 'warning'| 'error'| 'validating'| undefined;
}> {
    state = {
        value: 1,
        visible: false,
        status: undefined,
        help: '',
    };

    handleOnChange = (value) => {
        this.check(value);
        this.setState({value});
    };

    check(value: number){
        if(value < 1 || isNaN(Number(value))){
            this.setState({help: '请输入正确的数字', status: 'error'});
        }else {
            this.setState({help: '', status: 'success'});
        }
    }

    handleOk = async () => {
        const {value, help} = this.state;
        if(help === ''){
            const {recharge} = this.props as Props;
            let url = await recharge(value);

            if(url.indexOf('http:') >= 0){
                window.open(url);
                this.setState({visible: true});
                return true;
            }else{
                notification.error({
                    message: '资金充值失败',
                    description: url,
                });
                return false;
            }
        }

        return false;

    };

    render() {
        const {getUserAssets} = this.props as Props;
        const {value, visible, help, status} = this.state;
        const formItemLayout = {
            labelCol: {
                sm: {span: 10},
                xs: {span: 10},
            },
            wrapperCol: {
                sm: {span: 7},
                xs: {span: 7},
            },
        };
        return (
            <div>
                <span>资金账户</span>
                <MyModal
                    title="资金充值"
                    handleOk={this.handleOk}
                    content={
                        <Form>
                            <Form.Item
                                {...formItemLayout}
                                label={'充值金额'}
                                extra="请输入大于1元的金额"
                                validateStatus={status}
                                help={help}
                            >
                                <InputNumber
                                    style={{width: '100%'}}
                                    min={1}
                                    precision={3}
                                    defaultValue={value}
                                    onChange={this.handleOnChange}
                                    formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </Form>
                    }
                   >
                    <Button
                        type="primary"
                        ghost={true}
                        style={{float: 'right', marginTop: '10px'}}
                    >充值</Button>
                </MyModal>
                <Modal visible={visible}
                       onCancel={() => this.setState({visible: false})}
                       onOk={() => {this.setState({visible: false});getUserAssets();}}>
                    <span>是否已完成充值</span>
                </Modal>
            </div>
        );
    }
}