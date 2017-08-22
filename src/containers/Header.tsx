import {Header as Component} from '../components/Header';
import {inject, observer} from 'mobx-react';

@inject((stores, props) => {
    return {
        ...props,
        user:stores.userStore,
        navigation: stores.productStore.list.map((product) => {
            return {text: product.name, link: `/product/${product.code}`};
        }),
        loadNavigation: () => {
            stores.productStore.loadProducts();
        }
    };
})
@observer
export class Header extends Component {
}