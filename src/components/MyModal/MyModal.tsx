import * as React from 'react';
import {Modal, Icon, Button} from 'antd';

export class MyModal extends React.Component<{
    content: React.ReactNode | string,
    title: React.ReactNode | string,
}, {
    visible: boolean,
}> {
    state = {
        visible: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
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
        const {visible} = this.state;
        return (
            <span onClick={this.showModal}>
                {children}
                <Modal
                    style={{textAlign: 'center'}}
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
            </span>
        );
    }
}