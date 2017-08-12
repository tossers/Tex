import {Route, Redirect} from "react-router-dom";
import {user} from "../stores";
import * as React from "react";
export class PrivateRoute extends React.Component<{
    component,
    path?: string,
    exact?: boolean;
    strict?: boolean
}, {}> {

    render() {
        let {component: Component, ...rest} = this.props;
        return (
            <Route {...rest} render={(props) => (user.isLogin ? (<Component {...props}></Component>) :
                <Redirect to={{pathname: '/login', state: {from: props.location}}}></Redirect>)}></Route>
        )
    }
}