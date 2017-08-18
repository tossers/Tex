import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import * as React from 'react';
import {Login} from '../containers/Login';
import {Home} from '../containers/Home';
import {Me} from '../containers/Me';
import {PrivateRoute} from '../containers/PrivateRoute';

export default class AppRouter extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <ul>
                        <li><Link to={'/me'}>Me</Link></li>
                        <li><Link to={'/me/aaa'}>Ca</Link></li>
                        <li><Link to={'/public'}>Public</Link></li>
                    </ul>
                    <Route path={'/'} exact={true} component={Home}/>
                    <Route path={'/login'} component={Login}/>
                    <Route path={'/public'} component={Home}/>
                    <PrivateRoute path={'/me'} component={Me}/>
                    <PrivateRoute path={'/me/aaa'} component={Home}/>
                </div>
            </Router>
        );
    }
}
