import {Login as Component} from '../components/Login';
import {inject, observer} from 'mobx-react';

// @inject('userStore')

@inject((stores, props) => {
    return {
        ...props,
        userStore: stores.userStore,
        product: stores.productStore.current,
    };
})
@observer
export class Login extends Component {
}