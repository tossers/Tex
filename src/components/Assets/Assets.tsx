import React from 'react';
import {toFixed} from '../../util/index';

export interface AssetsModel {
    uid: number;                  //用户id
    id: number;                   //资金账户id
    available: number;            //可用资金
    margin: number;               //成交保证金
    trust: number;                //委托保证金
}

export interface Props{
    assets: AssetsModel;
    getUserAssets: () => void;
}

export class Assets extends React.Component<Props| {}>{
    componentWillMount(){
        const {getUserAssets} = this.props as Props;
        getUserAssets();
    }

    render(){
        const {assets} = this.props as Props;
        const style = {float: 'right'};
        return (
            <ul style={{padding: '16px'}}>
                <li><span>用户ID:</span><span style={style}>{assets.uid}</span></li>
                <li><span>资金账户ID:</span><span style={style}>{assets.id}</span></li>
                <li><span>可用资金:</span><span style={style}>{toFixed(assets.available, 3)}</span></li>
                <li><span>成交保证金:</span><span style={style}>{toFixed(assets.margin, 3)}</span></li>
                <li><span>委托保证金:</span><span style={style}>{toFixed(assets.trust, 3)}</span></li>
            </ul>
        );
    }
}