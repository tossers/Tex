import * as React from 'react';
import { Upload, Modal } from 'antd';
import {UploadFile} from 'antd/es/upload/interface';

export class PicturesWall extends React.Component<{
    fileList: UploadFile[]
}, {
    previewVisible: boolean;
    previewImage: string;
    // popoverVisible: boolean;
}>{
    state = {
        previewVisible: false,
        previewImage: '',
        // fileList: [{
        //     size: 1000,
        //     uid: -1,
        //     name: 'xxx.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // }, {
        //     size: 1000,
        //     uid: -1,
        //     name: 'xxx.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // }],
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    render() {
        const { previewVisible, previewImage } = this.state;
        const {fileList} = this.props;
        return (
            <div className="clearfix">
                <Upload
                    className="picturesWall"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                />
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
