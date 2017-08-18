import * as React from 'react';
import {Redirect} from 'react-router';
import './Login.css';
import {Location} from 'history';

export class Login extends React.Component<{ location: Location, userStore: { login: (userName: string, passWord: string) => Promise<void> } }, { redirectToReferrer: Boolean, isError: Boolean, message: String | null }> {

    state = {
        redirectToReferrer: false,
        isError: false,
        message: null
    };

    async login() {
        try {
            this.setState({message: '正在登录', isError: false});
            const userName = (this.refs.userName as HTMLInputElement).value;
            const userPass = (this.refs.passWord as HTMLInputElement).value;
            await this.props.userStore.login(userName, userPass);
            this.setState({
                redirectToReferrer: true
            });
        } catch (ex) {
            this.setState({isError: true, message: ex.message});
        }

    }

    render() {

        const {from} = this.props.location.state || {from: {pathname: '/'}};
        const {redirectToReferrer, isError, message} = this.state;
        if (redirectToReferrer) {
            return (<Redirect to={from}/>);
        }

        return (
            <div>
                <div>
                    <span>userName:</span><input ref={'userName'}/>
                </div>
                <div>
                    <span>passWord:</span><input ref={'passWord'}/>
                </div>
                <div>
                    {message && <div className={isError ? 'error' : ''}>{message}</div>}
                    <button onClick={() => {
                        this.login();
                    }}>Login
                    </button>
                </div>
            </div>
        );
    }
}