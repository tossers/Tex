import * as React from 'react';
import {Modal,InputNumber, Button, notification, Row, Col, Slider, Icon} from 'antd';
import {patchLeverage} from '../../../api/Index';

export class AdjustLever extends React.Component<{
    getPositionList: () => void;     //刷新持仓列表
    productId: number,               //产品id
}, {
    visible: boolean,
    lever: number,
}> {
    state = {
        visible: false,
        lever: 1,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        const {productId} = this.props;
        const {lever} = this.state;
        patchLeverage(productId, lever).then(() => {
            notification.success({
                message: '修改成功',
                description: '修改成功',
            });
            this.setState({
                visible: false,
            });
        }).catch((ex) => {
            notification.error({
                message: '操作失败',
                description: ex.message,
            });
        }).then(()=>this.props.getPositionList());

    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    footerRender = () =>
        (
            <Button.Group>
                <Button onClick={this.handleCancel}><Icon type="close" />取消</Button>
                <Button onClick={this.handleOk}>确认</Button>
            </Button.Group>
        )

    titleRender = () => <h3>调整杠杆</h3>;

    render() {
        const {children} = this.props;
        const {visible, lever} = this.state;
        return (
            <span onClick={this.showModal}>
                {children}
                <Modal
                    className="myBtnGroup"
                    footer={this.footerRender()}
                    title={this.titleRender()}
                    onCancel={this.handleCancel}
                    visible={visible}
                >
                    <Row style={{padding: '20px 0'}}>
                        <Col style={{paddingRight: '4px', textAlign: 'right', lineHeight: '2.5'}} span={6}>
                            <span>杠杆：</span>
                        </Col>
                        <Col span={11}>
                            <Slider
                                min={1}
                                step={1}
                                max={100}
                                tipFormatter={(value) => 'x' + value}
                                value={lever}
                                onChange={(value) => (this.setState({lever: Number(value)}))}
                            />
                        </Col>
                        <Col span={5}>
                            <InputNumber
                                min={1}
                                max={100}
                                formatter={(value) => 'x' + value}
                                value={lever}
                                onChange={(value) => this.setState({lever: Number(value)})}
                            />
                        </Col>
                    </Row>
                </Modal>
            </span>
        );
    }
}