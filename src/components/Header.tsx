import * as React from 'react';
import {Link} from 'react-router-dom';
import {Menu, Icon} from 'antd';
// import {isLogin} from '../api/Index';
import './Header.css';
import {Redirect} from 'react-router';
// import 'antd/lib/menu/style';

export class Header extends React.Component<{
    location?: Location;
    navigation: { text: string, link: string, id: number }[],
    user: { isLogin: boolean, nickName: string, uid: string, assetsId: number },
    logout: () => void,
    product: { id: number },
    loadNavigation: () => {},
}, {}> {

    componentWillMount() {
        this.props.loadNavigation();
    }

    handleOnClick = (item) => {
        if(item.key === 'logout'){
            this.props.logout();
        }
    }

    render() {
        const selectKeys = this.props.product && this.props.product.id && [this.props.product.id.toString()] || [];
        return (
            <div className="headerMenu" >
                <Menu mode={'horizontal'} onClick={this.handleOnClick} selectedKeys={selectKeys}>
                    {
                        this.props.navigation.map((item) => {
                            return (
                                <Menu.Item key={item.id}>
                                    <Link to={item.link}/>{item.text}
                                </Menu.Item>
                            );
                        })
                    }
                    {
                        this.props.user.isLogin?
                            <Menu.SubMenu title={<span><Icon type="user"/>{this.props.user.assetsId}</span>}>
                                <Menu.Item key="logout">
                                    Sign out
                                </Menu.Item>
                            </Menu.SubMenu>
                            :
                           null
                    }
                </Menu>
                {
                    (!this.props.user.isLogin && selectKeys.length > 0) ?
                        <Redirect  to={{pathname: '/login', state: {from: this.props.location}}}/>
                        :
                        null
                }
            </div>
        );

    }

}