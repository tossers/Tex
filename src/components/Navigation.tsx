import * as React from 'react';
import {Link} from 'react-router-dom';
import './Navigation.css';

export class Navigation extends React.Component<{
    navigation: {
        text: string;
        link: string;
    }[],
    user: { isLogin: boolean, nickName: string, uid: string }
}> {

    render() {
        if (!this.props.navigation.length) {
            return (<div>没有导航</div>);
        }
        return (
            <div className="navigation">
                <ul>
                    {this.props.navigation.map((item) => {
                        return (
                            <li key={item.link}><Link to={item.link}>{item.text}</Link></li>
                        );
                    })}
                </ul>
            </div>
        );
    }

}