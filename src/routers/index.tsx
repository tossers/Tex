import {BrowserRouter as Router, Route} from 'react-router-dom';
import * as React from 'react';
import {Header} from '../containers/Header';
import {Product} from '../containers/Product';
import {Login} from '../containers/Login';
import {PrivateRoute} from '../containers/PrivateRoute';
import 'antd/dist/antd.css';

export default class AppRouter extends React.Component {

    render() {
        return (
            <div>
                <Router>
                    <div style={{fontFamily:'consolas,微软雅黑'}}>
                        <Route path="/" component={Header}/>
                        <Route path="/login" component={Login}/>
                        <div>
                            <PrivateRoute path="/product/:id" component={Product}/>
                        </div>
                        <div>
                            CopyRight&copy;Tex.tuling.me
                        </div>
                    </div>
                </Router>
            </div>
        );
    }
}
