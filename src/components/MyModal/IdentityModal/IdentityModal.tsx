import * as React from 'react';
import {MyModal} from '../MyModal';
import {Form, Input, notification} from 'antd';
import {FormComponentProps} from 'antd/es/form/Form';
import {UploadPictures} from './UploadPicture';

export interface Props{
    identityCheck: (identityId: string, name: string, topper: string, under: string) => Promise<void>;
}

class Identityform extends React.Component<Props & FormComponentProps, {
    identity: string;
    under: string;
    topper: string;
    validateStatus: 'success' | 'warning' | 'error' | 'validating'| undefined;
    help: string;
}>{
    state = {
        identity: '',
        under: '',
        topper: '',
        help: '',
        validateStatus: undefined,
    };

    handleSubmit = async () => {
        let result = false;
        this.checkPictures();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err && this.state.validateStatus === 'success') {
                const {under, topper} = this.state;
                const {identity, name} = values;
                await this.props.identityCheck(identity, name, topper, under).then(() =>{
                    notification.success({
                        message: '操作成功',
                        description: '上传身份证成功',
                    });
                    result = true;
                }).catch((ex) => {
                    notification.error({
                        message: '操作失败',
                        description: ex.message,
                    });
                    result = false;
                });
            }
        });
        return result;
    };

    checkIdentity = (rule, value, callback) => {
        let pattern = /^\d{15}(\d{2}[A-Za-z0-9])?$/;
        if (pattern.test(value)) {
            this.setState({identity: value});
            callback();
        }else {
            this.setState({identity: ''});
            if(value){
                callback('请输入正确的身份证号码！');
            }else{
                callback();
            }
        }
    };

    beforeUpload = (file) => {
        const isLt500K = file.size / 1024 / 1024 < 0.5;
        if (!isLt500K) {
            this.setState({help: '请上传少于500K的图片!', validateStatus: 'error'});
        }
        return isLt500K;
    };

    identityForm = () => {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };

        return (
                <div className="login">
                    <Form style={{maxWidth: '560px'}} className="login-form">
                        <Form.Item
                            {...formItemLayout}
                            label="姓名"
                        >
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true, message: '请输入姓名！'
                                }],
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="身份证号码"
                        >
                            {getFieldDecorator('identity', {
                                rules: [{
                                    required: true, message: '请输入姓名身份证号码！'
                                },{
                                    validator: this.checkIdentity,
                                }],
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="身份证照片"
                            extra="身份验证将在几天后得到结果"
                            required={true}
                            validateStatus={this.state.validateStatus}
                            help={this.state.help}
                        >
                            <div style={{display: 'inline-block', verticalAlign: 'text-bottom'}}>
                                <UploadPictures title="正面" beforeUpload={this.beforeUpload} onChange={(picUrl) => {
                                    this.setState({topper: picUrl});
                                    this.checkPictures();
                                }}/>
                            </div>
                            <div style={{display: 'inline-block', verticalAlign: 'text-bottom'}}>
                                <UploadPictures title="反面" beforeUpload={this.beforeUpload} onChange={(picUrl) => {
                                    this.setState({under: picUrl});
                                    this.checkPictures();
                                }}/>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
        );
    };

    checkPictures = () => {
        const {topper, under} = this.state;
        if(topper && under){
            this.setState({help: '', validateStatus: 'success'});
        }else{
            this.setState({help: '请上传身份证正反面!', validateStatus: 'error'});
        }
    };

    render(){
        const {children} = this.props;
        return (
            <MyModal children={children} content={this.identityForm()} title={'身份验证'} handleOk={this.handleSubmit}/>
        );
    }
}

export const IdentityModal = Form.create()(Identityform);