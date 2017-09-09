import * as React from 'react';
import {Link} from 'react-router-dom';
import Menu from 'antd/lib/menu';
import 'antd/lib/menu/style';

export class Header extends React.Component<{
        navigation: { text: string, link: string, id:number }[],
        user: { isLogin: boolean, nickName: string, uid: string },
        product:{id: number},
        loadNavigation: () => {},
    }> {

    componentWillMount() {
        this.props.loadNavigation();
    }

    render() {
        const selectKeys = this.props.product && this.props.product.id && [this.props.product.id.toString()] || [];
        return (
            <div>
                <Menu mode={'horizontal'} selectedKeys={selectKeys}>
                    {
                        this.props.navigation.map((item)=>{
                        return (
                            <Menu.Item key={item.id}>
                                <Link to={item.link}/>{item.text}
                            </Menu.Item>
                            );
                        })
                    }
                </Menu>
            </div>
        );

    }

}