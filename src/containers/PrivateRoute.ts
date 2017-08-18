import {PrivateRoute as Component} from '../components/PrivateRoute';
import {inject} from 'mobx-react';

@inject('userStore')
export class PrivateRoute extends Component {
}