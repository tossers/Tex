import {Me as Component} from '../components/Me';
import {inject} from 'mobx-react';

@inject('userStore')
export class Me extends Component{}