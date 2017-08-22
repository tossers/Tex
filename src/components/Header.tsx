import * as React from 'react';
import {Navigation} from './Navigation';

export class Header extends React.Component<{
    navigation: { text: string, link: string }[],
    loadNavigation: () => {},
    user: { isLogin: boolean, nickName: string, uid: string }
}> {

    componentWillMount() {
        this.props.loadNavigation();
    }

    render() {

        return (
            <div>
                <Navigation navigation={this.props.navigation} user={this.props.user}/>
            </div>
        );

    }

}