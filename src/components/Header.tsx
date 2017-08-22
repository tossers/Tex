import * as React from 'react';
import {Link} from 'react-router-dom';
import Menu from 'antd/lib/menu';
import 'antd/lib/menu/style';

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
                <Menu mode={'horizontal'}>
                    {this.props.navigation.map((item)=>{
                        return (
                            <Menu.Item key={item.link}><Link to={item.link}/>{item.text}</Menu.Item>
                        );
                    })}
                </Menu>
            </div>
        );

    }

}