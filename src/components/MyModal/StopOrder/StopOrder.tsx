import * as React from 'react';
import {Form, InputNumber, notification} from 'antd';
import {MyModal} from '../MyModal';

export class StopOrder extends React.Component<{
    stopOrder: (productId: number, stopLoss: number, stopProfit: number) => Promise<void>;  //设置止盈止损
    productId: number;               //产品id
    avgPrice: number;
    position: number;
}, {
    stopLoss: number;
    stopProfit: number;
    proHelp: string;
    lossHelp: string;
    proStatus: 'success'| 'warning'| 'error'| 'validating'| undefined;
    lossStatus: 'success'| 'warning'| 'error'| 'validating'| undefined;
}> {
    state = {
        stopLoss: 0,
        stopProfit: 0,
        lossHelp: '',
        proHelp: '',
        proStatus: undefined,
        lossStatus: undefined,
    };

    check = (stopLoss, stopProfit) => {
        const {avgPrice, position} = this.props;

        let lossHelp = '';
        let lossStatus: 'success'| 'warning'| 'error'| 'validating'| undefined = 'success';
        let proHelp = '';
        let proStatus: 'success'| 'warning'| 'error'| 'validating'| undefined = 'success';

        if(stopLoss === 0 && stopProfit === 0){
            // this.setState({lossHelp: '止盈和止损请至少设置一个', proStatus: 'error', lossStatus: 'error'});
            lossHelp = '止盈和止损请至少设置一个';
            lossStatus = 'error';
            proStatus = 'error';
            this.setState({lossHelp, proHelp, lossStatus, proStatus});
            return false;
        }
        if(stopProfit !== 0){
            if(stopProfit > avgPrice && position < 0){
                // this.setState({proHelp: '止盈必须大于均价', proStatus: 'error'});
                proHelp = '止盈必须小于均价';
                proStatus = 'error';
            }
            if(stopProfit < avgPrice && position > 0){
                // this.setState({proHelp: '止盈必须小于均价', lossStatus: 'error'});
                proHelp = '止盈必须大于均价';
                proStatus = 'error';
            }
        }

        if(stopLoss !== 0){
            if(stopLoss < avgPrice && position < 0){
                // this.setState({lossHelp: '止损必须小于均价', proStatus: 'error'});
                lossHelp = '止损必须大于均价';
                lossStatus = 'error';
            }
            if(stopLoss > avgPrice && position > 0){
                lossHelp = '止损必须小于均价';
                lossStatus = 'error';
                // this.setState({lossHelp: '止损必须大于均价', lossStatus: 'error'});
            }
        }

        this.setState({lossHelp, proHelp, lossStatus, proStatus});
        return lossStatus === 'success' && proStatus === 'success';
    };

    handleOk = async () => {
        let result = false;
        const {productId, stopOrder} = this.props;
        const {stopLoss, stopProfit} = this.state;
        if(this.check(stopLoss, stopProfit)){
            if(stopLoss === 0 && stopProfit === 0){
                this.setState({lossHelp: '止盈和止损请至少设置一个', proStatus: 'error', lossStatus: 'error'});
                return false;
            }
            await stopOrder(productId, stopLoss, stopProfit).then(() => {
                notification.success({
                    message: '操作成功',
                    description: '设置止盈止损成功',
                });
                result = true;
            }).catch((ex) => {
                notification.error({
                    message: '操作失败',
                    description: ex.message,
                });
            });
            return result;
        }else {
            return result;
        }
    };

    updateStopProfit = (stopProfit: number) => {
        const {stopLoss} = this.state;
        this.check(stopLoss, stopProfit);
        this.setState({stopProfit});
    };

    updateStopLoss = (stopLoss: number) => {
        const {stopProfit} = this.state;
        this.check(stopLoss, stopProfit);
        this.setState({stopLoss});
    };

    render() {
        const formItemLayout = {
            labelCol: {
                sm: {span: 6},
                xs: {span: 6},
            },
            wrapperCol: {
                sm: {span: 14},
                xs: {span: 14},
            },
        };
        const {stopProfit, stopLoss, lossHelp, lossStatus, proHelp, proStatus} = this.state;
        const {children} = this.props;
        return (
            <MyModal handleOk={this.handleOk}
                     title="设置止盈止损"
                     content={
                         <Form>
                             <Form.Item
                                 {...formItemLayout}
                                 validateStatus={proStatus}
                                 help={proHelp}
                                 label="止盈">
                                 <InputNumber
                                     step={0.001}
                                     min={0}
                                     style={{width: '100%'}}
                                     formatter={value => value === '0.000' ? '不设置' : `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                     value={stopProfit}
                                     onChange={this.updateStopProfit}
                                 />
                             </Form.Item>
                             <Form.Item
                                 {...formItemLayout}
                                 label="止损"
                                 extra="可以输入0达到不设置的目的"
                                 validateStatus={lossStatus}
                                 help={lossHelp}
                             >
                                 <InputNumber
                                     step={0.001}
                                     style={{width: '100%'}}
                                     min={0}
                                     formatter={value => value === '0.000' ? '不设置' : `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                     value={stopLoss}
                                     onChange={this.updateStopLoss}
                                 />
                             </Form.Item>
                         </Form>
                     }>
                {children}
            </MyModal>
        );
    }
}