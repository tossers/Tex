import React from 'react';
import {toFixed} from '../../util/index';
import './Assets.css';
import {CheckStatus} from './CheckStatus';

export interface AssetsModel {
    uid: number;                  //用户id
    id: number;                   //资金账户id
    available: number;            //可用资金
    margin: number;               //成交保证金
    trust: number;                //委托保证金
}
//1为审核成功 -1为审核失败 0为正在审核中
export interface Props{
    identityId: string;
    name: string;
    checkStatus: number;
    assets: AssetsModel;
    getUserAssets: () => void;
    identityCheck: (identityId: string, name: string, topper: string, under: string) => Promise<void>;
    identityCheckStatus: () => void;
    underUrl: string;
    topUrl: string;
}

export class Assets extends React.Component<Props| {}>{
    componentWillMount(){
        const {getUserAssets, identityCheckStatus} = this.props as Props;
        getUserAssets();
        identityCheckStatus();
    }

    render(){
        const {assets, name, checkStatus, identityCheck, underUrl, topUrl, identityId} = this.props as Props;
        return (
            <div className="assets">
                <ul>
                    <li><span>用户:</span><span>{name}</span></li>
                    <li><span>资金账户ID:</span><span>{assets.id}</span></li>
                    <li><span>可用资金:</span><span>{toFixed(assets.available/ 1000000, 3)}</span></li>
                    <li><span>成交保证金:</span><span>{toFixed(assets.margin/ 1000000, 3)}</span></li>
                    <li><span>委托保证金:</span><span>{toFixed(assets.trust/ 1000000, 3)}</span></li>
                    <li><span>身份验证状态:</span><span>
                        <CheckStatus
                            identityCheck={identityCheck}
                            checkStatus={checkStatus}
                            identityId={identityId}
                            name={name}
                            underUrl={underUrl}
                            topUrl={topUrl}
                        />
                    </span></li>
                </ul>
            </div>
        );
    }
}