import {Login as Component} from '../components/Login';
import {inject, observer} from 'mobx-react';

@inject('userStore')
@observer
export class Login extends Component {
}