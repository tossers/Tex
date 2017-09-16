import * as React from 'react';
import {sendMessage, registByPhone} from '../api/Index';
import {Redirect} from 'react-router';
import './Login.css';
import {Form, Input, Button,Spin, Select, Row, Col, message} from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';

class RegisterForm extends React.Component<FormComponentProps , {
    confirmDirty: boolean,
    redirectToLogin: Boolean,
    phone: string,
    spinning: boolean,
    id: number,
    loading: boolean,
    count: number,
}> {

    state = {
        confirmDirty: false,
        redirectToLogin: false,
        phone: '',
        spinning: false,
        loading: false,
        id: -1,
        count: 60,
    };
    interval;

    CountOneMinute = () => {
        this.interval = setInterval(() => {
            let {count} = this.state;
            if(count === 0){
                clearInterval(this.interval);
                this.setState({count: 60, id: -1});
                return;
            }
            this.setState({count: count - 1});
        }, 1000);
    }

    handleGetCode = () => {
        const {phone} = this.state;
        if(phone){
            this.setState({loading: true});
            sendMessage(phone).then((id) => {
                this.setState({loading: false, id});
                this.CountOneMinute();
            }).catch((ex) => {
                message.error(ex.message);
            });
        }else {
            message.error('input correct phone number');
        }
    }

    checkPhone = (rule, value, callback) => {
        let pattern = /^((\(\d{3}\))|(\d{3}\-))?13\d{9}$/;
        if (pattern.test(value)) {
            this.setState({phone: value});
            callback();
        }else {
            this.setState({phone: ''});
            if(value){
                callback('please input the correct phone number');
            }else{
                callback();
            }
        }
    }

    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {

            if (!err) {
                this.setState({spinning: true});
                const {password, code} = values;
                registByPhone(this.state.id, password, code).then((codes) => {
                    this.setState({spinning: false,});
                    if(codes === 1){
                        message.success('注册成功,请登录');
                        setTimeout(() => {
                            this.setState({redirectToLogin: true});
                        }, 2000);
                    }else if(codes === -1006){
                        message.error('用户已存在');
                    }else if(codes === -1005){
                        message.error('注册失败');
                    } else{
                        message.error('注册错误:' + codes);
                    }
                }).catch((ex) => {
                    message.error(ex.message);
                    this.setState({spinning: false});
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {id, count, spinning, loading, redirectToLogin} = this.state;
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

        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 60 }}>
                <Select.Option value="86">+86</Select.Option>
                <Select.Option value="87">+87</Select.Option>
            </Select>
        );

        if(redirectToLogin){
            return <Redirect to={'/login'} />;
        }

        return (
            <Spin size="large" tip="正在注册" spinning={spinning}>
                <div className="login">
                    <Form style={{maxWidth: '560px'}} className="login-form" onSubmit={this.handleSubmit}>
                        <Form.Item
                            {...formItemLayout}
                            label="Phone Number"
                        >
                            {getFieldDecorator('phone', {
                                rules: [{
                                    required: true, message: 'Please input your phone number!'
                                },{
                                    validator: this.checkPhone,
                                }],
                            })(
                                <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="Password"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: 'Please input your password!',
                                }, {
                                    validator: this.checkConfirm,
                                }],
                            })(
                                <Input type="password" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="Confirm Password"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: 'Please confirm your password!',
                                }, {
                                    validator: this.checkPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="Auth Code"
                            extra="the code will be overdue after one minute"
                        >
                            <Row gutter={8}>
                                <Col span={12}>
                                    {getFieldDecorator('code', {
                                        rules: [{ required: true, message: 'Please input the code you got!' }],
                                    })(
                                        <Input size="large" />
                                    )}
                                </Col>
                                <Col span={12}>
                                    {
                                        id === -1 ?
                                            <Button onClick={this.handleGetCode} loading={loading} size="large">Get Code</Button>
                                            :
                                            <Button  style={{cursor: 'not-allowed'}} size="large">{count + 's'}</Button>
                                    }
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label=" "
                            colon={false}
                        >
                            <Button type="primary" htmlType="submit">register</Button>
                            <Button type="primary" style={{marginLeft: '20px'}} onClick={() => this.setState({redirectToLogin: true})}>Log in</Button>
                        </Form.Item>

                    </Form>
                </div>
            </Spin>
        );
    }
}

export const Register =  Form.create()(RegisterForm);