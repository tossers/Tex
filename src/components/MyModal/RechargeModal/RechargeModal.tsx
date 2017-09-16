import * as React from 'react';
import {Button, InputNumber, Modal, notification} from 'antd';
import {MyModal} from '../MyModal';
// import {Throttle} from '../../util/Throttle';
export interface Props{
    getUserAssets: () => void;
    recharge: (money: number) => void;
    url: string;
}

export class RechargeModal extends React.Component< Props| {}, {
    value: number;
    visible: boolean;
}> {
    state = {
        value: 1,
        visible: false,
    };

    timer;

    handleOnChange = (value) => {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            const {recharge} = this.props as Props;
            if(value && typeof(value) === 'number'){
                recharge(value);
            }
            this.setState({value});
        }, 300);
    }

    handleOk = async () => {
        const {url} = this.props as Props;
        const {value} = this.state;
        if(value && typeof(value) === 'number'){
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
        }else {
            const {recharge} = this.props as Props;
            notification.error({
                message: '资金充值失败',
                description: '请输入正确的数字',
            });
            recharge(1);
            this.setState({value: 1});
            return false;
        }
    }

    render() {
        const {getUserAssets, recharge} = this.props as Props;
        const {value, visible} = this.state;
        return (
            <div>
                <span>资金账户</span>
                <MyModal
                    title="资金充值"
                    handleOk={this.handleOk}
                    content={
                        <div>
                            <span>充值金额：</span>
                            <InputNumber
                                min={1}
                                precision={3}
                                defaultValue={value}
                                onChange={this.handleOnChange}
                                formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </div>
                    }
                   >
                    <Button
                        onClick={() => recharge(value)}
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