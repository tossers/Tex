import * as React from 'react';
import './Entrust.css';
import {notification} from 'antd';

export class Entrust extends React.Component<{ entrust: (type: string, price: number, quantity: number) => Promise<void> }> {

    entrust(type: string) {
        const price = Number((this.refs.price as HTMLInputElement).value);
        const quantity = Number((this.refs.quantity as HTMLInputElement).value)
        this.props.entrust(type, price, quantity).then(() => {
            notification.success({
                message: '下单成功',
                description: '下单成功'
            });
        }).catch((ex) => {
            notification.error({
                message: '下单失败',
                description: ex.message,
            });
        });
    }

    render() {

        return (
            <div className="entrust">
                <div className="item">
                    <span>价格</span><input type="number" ref={'price'} onMouseDown={(e) => e.stopPropagation()}
                                          onMouseMove={(e) => e.stopPropagation()}/>
                </div>
                <div className="item">
                    <span>仓位</span><input type="number" ref={'quantity'} onMouseDown={(e) => e.stopPropagation()}
                                          onMouseMove={(e) => e.stopPropagation()}/>
                </div>
                <div className="item">
                    <button onClick={(e) => {
                        this.entrust('buy');
                        e.stopPropagation();
                    }} onMouseDown={(e) => e.stopPropagation()}>买入
                    </button>
                    <button onClick={(e) => {
                        this.entrust('sell');
                        e.stopPropagation();
                    }} onMouseDown={(e) => e.stopPropagation()}>卖出
                    </button>
                </div>
            </div>);

    }

}