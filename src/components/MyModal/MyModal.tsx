import * as React from 'react';
import {Modal, Icon, Button, notification} from 'antd';

export class MyModal extends React.Component<{
    content: React.ReactNode | string,
    title: React.ReactNode | string,
    handleOk: () => Promise<void>,
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

    handleOk = (e) => {
        this.setState({loading: true});
        this.props.handleOk().then(() => {
            notification.success({
                message: '操作成功',
                description: this.props.title + '成功',
                duration: 2,
            });
            this.setState({visible: false, loading: false,});
        }).catch((ex) => {
            notification.error({
                message: this.props.title + '失败',
                description: ex.message,
            });
            this.setState({visible: false, loading: false,});
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
                <Button loading={this.state.loading} onClick={this.handleOk}>确认</Button>
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