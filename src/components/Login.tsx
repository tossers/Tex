import * as React from 'react';
import {Redirect} from 'react-router';
import './Login.css';
import {Location} from 'history';
import {Form, Icon, Input, Button,Spin,message} from 'antd';

export class Login extends React.Component<{ location: Location, userStore: { login: (userName: string, passWord: string) => Promise<void> } },
    { redirectToReferrer: Boolean, userName: string, passWord: string, spinning: boolean }> {

    state = {
        redirectToReferrer: false,
        userName: '',
        passWord: '',
        spinning: false
    };

    async login() {
        this.setState({spinning:true});
        try {
            const userName = this.state.userName;
            const userPass = this.state.passWord;
            await this.props.userStore.login(userName, userPass);
            this.setState({
                redirectToReferrer: true
            });
        } catch (ex) {
            console.log(ex.stack);
            message.error(ex.message);
            this.setState({spinning:false});
        }

    }

    render() {

        const {from} = this.props.location.state || {from: {pathname: '/'}};
        const {redirectToReferrer} = this.state;
        if (redirectToReferrer) {
            return (<Redirect to={from}/>);
        }

        return (
            <Spin size="large" tip="登录中" spinning={this.state.spinning}>
                <div className="login">
                    <Form className="login-form">
                        <Form.Item>
                            <Input prefix={<Icon type="user"/>} type="text" onChange={(e) => {
                                this.setState({userName: e.target.value});
                            }}/>
                        </Form.Item>
                        <Form.Item>
                            <Input prefix={<Icon type="lock"/>} type="password" onChange={(e) => {
                                this.setState({passWord: e.target.value});
                            }}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" className="login-form-button" htmlType="submit" onClick={() => {
                                this.login();
                            }}>Log In</Button>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
        );
    }
}