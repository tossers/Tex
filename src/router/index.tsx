import * as React from 'react'
import {BrowserRouter, Link,Route, Switch} from 'react-router-dom'
import {Login} from "../components/Login";
import {PrivateRoute} from "../components/PrivateRoute";
import {Demo} from "../components/Demo";
import {Index} from "../components/Index";
import {NoFound} from "../components/NoFound";

export class Routers extends React.Component<{}, {}> {
    render() {
        return (
            <BrowserRouter basename="/">
                <div>
                    <ul>
                        <li>
                            <Link to="/demo">Demo</Link>
                        </li>
                        <li><Link to="/index">Index</Link>
                        </li>
                        <li><Link to="/demo2/home">Home</Link></li>
                    </ul>
                    <Switch>
                        <Route strict={true} exact={true} path="/" component={Index}/>
                        <Route strict={true} path="/login" component={Login}/>
                        <PrivateRoute strict={true} path="/demo" component={Demo}/>
                        <Route strict={true} component={NoFound}/>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}