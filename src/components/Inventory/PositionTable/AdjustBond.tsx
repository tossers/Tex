import * as React from 'react';
import {Modal, Icon, Radio, InputNumber, Button, notification} from 'antd';
import {toFixed} from '../../../util';
import {postBond} from '../../../api/Index';

export class AdjustBond extends React.Component<{
    getPositionList: () => void;            //刷新持仓列表
    getUserAssets: () => void;              //获取用户资金
    productId: number,                      //产品id
    position: number,                       //仓位
    bond: number,                           //保证金
    available: number,                      //可用资金
}, {
    visible: boolean,
    radioValue: string,                     //增加，减少
    numberValue: number,                    //增减量
}> {
    state = {
        visible: false,
        radioValue: '增加',
        numberValue: 0.001,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        const {productId} = this.props;
        const {numberValue, radioValue} = this.state;
        let result = -numberValue;
        if(radioValue === '增加'){
            result = numberValue;
        }
        postBond(productId, result).then(() => {
            notification.success({
                message: '修改成功',
                description: '修改成功',
            });
            this.setState({
                visible: false,
            });
        }).catch((ex)=>{
            notification.error({
                message: '操作失败',
                description: ex.message,
            });
        }).then(() => {
            this.props.getPositionList();
            this.props.getUserAssets();
        });

    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    onRadioChange = (e) => {
        this.setState({
            radioValue: e.target.value === 1? '增加':　'减少',
        });
    }

    onNumberChange = (value) => {
        this.setState({
            numberValue: value,
        });
    }

    footerRender = () =>
        (
            <Button.Group>
                <Button onClick={this.handleCancel}><Icon type="close" />取消</Button>
                <Button onClick={this.handleOk}>{this.state.radioValue}保证金</Button>
            </Button.Group>
        )

    titleRender = () => <h3>增加/减少仓位保证金</h3>;

    render() {
        const {position, bond, available, children} = this.props;
        const {visible, radioValue} = this.state;
        return (
            <span onClick={this.showModal}>
                {children}
                <Modal
                    style={{textAlign: 'center'}}
                    className="myBtnGroup"
                    footer={this.footerRender()}
                    title={this.titleRender()}
                    onCancel={this.handleCancel}
                    visible={visible}
                >
                    <Radio.Group onChange={this.onRadioChange} defaultValue={1}>
                         <Radio value={1}>增加保证金</Radio>
                         <Radio value={2}>减少保证金</Radio>
                    </Radio.Group>
                    <div style={{margin: '10px 0'}}>
                        <div>你的当前仓位：{position}</div>
                        <div>当前你已分配的保证金：{toFixed(bond,3)}</div>
                        <div>可用保证金：{toFixed(available, 3)}</div>
                    </div>
                    <div style={{borderTop: '1px solid #c5baba'}}/>
                    <div style={{margin: '10px 0'}}>
                        <h2>{radioValue}保证金</h2>
                        <InputNumber
                            style={{width: '50%'}}
                            min={0.001}
                            max={available}
                            step={0.001}
                            precision={3}
                            defaultValue={0.001}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            onChange={this.onNumberChange} />
                    </div>
                </Modal>
            </span>
        );
    }
}