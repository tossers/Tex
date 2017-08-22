import * as React from 'react';
import './Entrust.css';

export class Entrust extends React.Component<{ entrust: (type: string, price: number, quantity: number) => void }> {

    entrust(type: string) {
        const price = Number((this.refs.price as HTMLInputElement).value);
        const quantity = Number((this.refs.quantity as HTMLInputElement).value)
        this.props.entrust(type, price, quantity);
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