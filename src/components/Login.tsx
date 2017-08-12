import * as React from "react";
import {user} from "../stores";
import {Redirect} from "react-router-dom";

export class Login extends React.Component<{ location }, { redirectToReferrer: boolean }> {

    state = {
        redirectToReferrer: false
    };

    async login() {
        await user.login("", "");
        this.setState({redirectToReferrer: true})

    }

    render() {

        const {from} = this.props.location.state || {from: {pathname: '/'}};
        const {redirectToReferrer} = this.state;
        if (redirectToReferrer) {
            return (
                <Redirect to={from}></Redirect>
            )
        }
        return (
            <div>
                Login
                <button onClick={async () => {
                    await this.login()
                }}>登录
                </button>
            </div>
        )
    }

}