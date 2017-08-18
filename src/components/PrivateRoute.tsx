import * as React from 'react';
import {Route, RouteComponentProps} from 'react-router-dom';
import {Location} from 'history';
import {Redirect} from 'react-router-dom';

export interface PrivateProps {
    component: React.ComponentClass;
    location?: Location;
    render?: ((props: RouteComponentProps<{}>) => React.ReactNode);
    children?: ((props: RouteComponentProps<{}>) => React.ReactNode) | React.ReactNode;
    path?: string;
    strict?: boolean;
    exact?: boolean;
    userStore?: { isLogin: boolean };
}

export class PrivateRoute extends React.Component<PrivateProps, {}> {
    render() {
        let {component: Component, userStore, ...rest} = this.props;
        return (
            <Route {...rest} render={props => (userStore && userStore.isLogin ? (<Component {...props}/>) : (
                <Redirect to={{pathname: '/login', state: {from: props.location}}}/>))}/>
        );
    }
}