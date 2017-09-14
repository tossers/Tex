import * as React from 'react';
import {Modal, Icon, Button} from 'antd';

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
        this.props.handleOk().then(()=>{
            this.setState({loading: false, visible: false});
        }).catch(() => {
            this.setState({loading: false, visible: false});
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