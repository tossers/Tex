import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import * as React from 'react';
import {Login} from '../containers/Login';
import {Home} from '../containers/Home';

export default class AppRouter extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Link to={'/login'}>Login</Link>
                    <Route path={'/'} exact={true} component={Home}/>
                    <Route path={'/login'} component={Login}/>
                </div>
            </Router>
        );
    }
}
