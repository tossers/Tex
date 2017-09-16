import * as React from 'react';
import {Button, Popover, Form, Input, Icon} from 'antd';
import {IdentityModal} from '../MyModal/IdentityModal/IdentityModal';
import {PicturesWall} from './PicturesWall';

export class CheckStatus extends React.Component<{
    checkStatus: number;
    identityCheck: (identityId: string, name: string, topper: string, under: string) => Promise<void>;
    underUrl: string;
    topUrl: string;
    name: string;
    identityId: string;
}, {}> {

    content() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
        };
        const { identityId, name} = this.props;

        return (
            <div>
                <Form style={{maxWidth: '300px'}} className="login-form">
                    <Form.Item
                        {...formItemLayout}
                        label="姓名"
                    >
                        <Input defaultValue={name} disabled={true} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="身份证号码"
                    >
                        <Input defaultValue={identityId} disabled={true} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="身份证照片"
                        extra="身份验证将在几天后得到结果"
                    >
                        <PicturesWall fileList={[{
                                size: 0,
                                uid: 1,
                                name: '',
                                status: 'done',
                                percent: 100,
                            }, {
                                size: 0,
                                uid: 2,
                                name: '',
                                status: 'done',
                                percent: 100,
                            }]}/>
                    </Form.Item>
                </Form>
            </div>

        );
    }

    render() {
        const {checkStatus, identityCheck} = this.props;
        let isCheck = true;
        let status = <span>loading..</span>;
        switch (checkStatus) {
            case 1:
                status =  <Button size="small"><Icon type="check" />审核成功</Button>;
                break;
            case 0:
                status = <Button size="small" loading={true}>正在审核</Button>;
                break;
            case -1:
                status = <Button size="small" type="danger" ghost={true} loading={true}>审核失败</Button>;
                break;
            case 2:
                isCheck = false;
                break;
            default:break;
        }

        return (
            isCheck ?
                (
                    <Popover placement="rightBottom" title={null} content={this.content()}>
                        <Button style={{padding: '0', border: '0'}}>{status}</Button>
                    </Popover>
                )
                :
                (
                    <IdentityModal identityCheck={identityCheck}>
                        <Button size={'small'}>马上验证</Button>
                    </IdentityModal>
                )
        );
    }
}