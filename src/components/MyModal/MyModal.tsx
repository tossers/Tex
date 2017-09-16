import * as React from 'react';
import {Modal, Icon, Button, Spin} from 'antd';

export class MyModal extends React.Component<{
    content: React.ReactNode | string,
    title: React.ReactNode | string,
    handleOk: () => Promise<boolean>,
}, {
    visible: boolean,
    loading: boolean,
}> {
    state = {
        visible: false,
        loading: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = async (e) => {
        this.setState({loading: true});
        const result = await this.props.handleOk();
        this.setState({loading: false, visible: !result});
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

    render() {
        const {content, title, children} = this.props;
        const {visible, loading} = this.state;
        return (
            <span onClick={this.showModal}>
                    {children}
                <Spin spinning={loading}>
                    <Modal
                        className="myBtnGroup"
                        footer={this.footerRender()}
                        title={title}
                        onCancel={this.handleCancel}
                        visible={visible}
                    >
                        {
                            content
                        }
                    </Modal>
                </Spin>
            </span>
        );
    }
}