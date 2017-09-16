import * as React from 'react';
import {Redirect} from 'react-router';
import './Login.css';
import {Location} from 'history';
import {Form, Icon, Input, Button,Spin,message} from 'antd';

export class Login extends React.Component<{
        product: {code: string},
        location: Location,
        userStore: {
            login: (userName: string, passWord: string) => Promise<void> ,
            isLoginFn:()=>Promise<void>
            isLogin: boolean;
        },
    }, {
        redirectToReferrer: Boolean,
        redirectToRegister: Boolean,
        userName: string,
        passWord: string,
        spinning: boolean,
    }> {

    state = {
        redirectToRegister: false,
        redirectToReferrer: false,
        userName: '',
        passWord: '',
        spinning: false,
    };

    // componentDidMount(){
    //     if(this.props.product && this.props.product.code){
    //         this.props.userStore.isLoginFn().then(()=>{
    //             this.setState({
    //                 redirectToReferrer: true
    //             });
    //         }).catch((ex)=>{
    //             console.log(ex);
    //         });
    //     }
    // }

    componentWillReceiveProps(Props: {userStore: {isLogin: boolean}, product: {code: string}}){
        //获取完product列表再进行token校验
        if(Props.product && Props.product.code && !Props.userStore.isLogin ){
            this.props.userStore.isLoginFn().then(()=>{
                this.setState({redirectToReferrer: true,});
            }).catch((ex)=>{
                // console.log(ex);
            });
        }
    }

    async login() {
        this.setState({spinning:true});
        try {
            const {userName, passWord} = this.state;
            // const {login} = this.props.userStore;
            // await login(userName, passWord);

            await this.props.userStore.login(userName, passWord);
            this.setState({
                redirectToReferrer: true
            });
        } catch (ex) {
            // console.log(ex.stack);
            message.error(ex.message);
            this.setState({spinning:false});
        }
    }

    render() {
        let {from} = this.props.location.state || {from: {pathname: `/`}};
        const {redirectToReferrer, redirectToRegister} = this.state;

        if (redirectToReferrer) {
            if(from.pathname.indexOf('product') < 0){
                from.pathname = `/product/${this.props.product.code}`;
            }
            return (<Redirect to={from}/>);
        }

        if(redirectToRegister){
            return (<Redirect to={'/register'}/>);
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
                            <Button
                                onClick={() => this.setState({redirectToRegister: true})}
                                style={{float: 'right', marginTop: '5px'}}
                                type="primary">register</Button>
                        </Form.Item>

                    </Form>
                </div>
            </Spin>
        );
    }
}