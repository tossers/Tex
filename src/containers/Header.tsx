import {Header as Component} from '../components/Header';
import {inject, observer} from 'mobx-react';

@inject((stores, props) => {
    return {
        ...props,
        user: stores.userStore,
        navigation: stores.productStore.list.map((product) => {
            return {text: product.name, link: `/product/${product.code}`, id: product.id};
        }),
        loadNavigation: () => {
            stores.productStore.loadProducts();
        },
        product: stores.productStore.current
    };
})
@observer
export class Header extends Component {
}