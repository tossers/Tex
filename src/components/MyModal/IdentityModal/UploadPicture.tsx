import * as React from 'react';
import { Upload, Icon, Modal } from 'antd';
import {UploadFile} from 'antd/es/upload/interface';

export class UploadPictures extends React.Component<{
    title: string;
    onChange: (picUrl: string) => void;
    beforeUpload: (file: UploadFile, FileList: UploadFile[]) => boolean;
}, {
    previewVisible: boolean;
    previewImage: string;
    fileList: UploadFile[];
}>{
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    getBase64(img: File, callback: (imageUrl: string) => void) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleChange = ({ fileList }) => {
        if(fileList.length > 0){
            this.getBase64(fileList[0].originFileObj, imageUrl => this.props.onChange(imageUrl));
        }else{
            this.props.onChange('');
        }
        if(fileList.length > 0){
            fileList[0].status = 'done';
        }
        this.setState({ fileList });
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">{this.props.title}</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    customRequest={() => {return;}}
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={this.props.beforeUpload}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    accept={'image/*'}
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
