import React from 'react';
import {Tabs} from 'antd';
import './Inventory.css';
import {OrderTableC, OrderTableModel} from './OrderTable/OrderTableC';
import {PositionTableC, PositionTableModel} from './PositionTable/PositionTableC';
import {EntrustTableC, EntrustTableModel} from './EntrustTable/EntrustTableC';

export {
    OrderTableModel,
    PositionTableModel,
    EntrustTableModel,
};
const TabPane = Tabs.TabPane;
export class Inventory extends React.Component<{}, {}> {
    render() {
        return (
            <Tabs className="inventory_style">
                <TabPane tab="持仓单" key="1">
                    <PositionTableC />
                </TabPane>
                <TabPane tab="委托单" key="2">
                    <EntrustTableC />
                </TabPane>
                <TabPane tab="成交单" key="3">
                    <OrderTableC />
                </TabPane>
            </Tabs>
        );
    }
}