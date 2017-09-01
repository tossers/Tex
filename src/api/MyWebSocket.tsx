import {notification} from 'antd';

// const webSocketUrl: string = window.location.host.indexOf('localhost')<0 ?
//     `ws://tex.tuling.me:8089/websocket?` :
//     `ws://127.0.0.1:8089/websocket?`
// ;
const webSocketUrl: string = `ws://tex.tuling.me:8089/websocket?`;
// readyState
// 0        CONNECTING        连接尚未建立
// 1        OPEN            WebSocket的链接已经建立
// 2        CLOSING            连接正在关闭
// 3        CLOSED            连接已经关闭或不可用

export class MyWebSocket{
    assetsId: number;

    instance: WebSocket;

    lock:boolean = true;

    cmd: string;

    getInstance(assetsId: number, openSend: string){
        if(!this.instance){
            this.assetsId = assetsId;
            this.cmd = openSend;
            this.connect();
        }
        return this.instance;
    }

    connect(){
        this.instance = new WebSocket(webSocketUrl+this.assetsId);
        this.instance.onopen = () => {
            this.instance.send(this.cmd);
        };
        this.instance.onclose = () => {
            this.reconnect();
        };

        this.instance.onerror = () => {
            this.reconnect();
        };
    }

    reconnect(){
        if(this.lock){
            this.lock = false;
            notification.error({
                key: 'wsReconnecting',
                message: 'WebSocket',
                description: 'WebSocket重连中',
                placement: 'bottomRight',
                duration: 99999999
            });
            let cycle = setInterval(() => {
                if(this.instance.readyState === 1 || this.instance.readyState === 2){
                    clearInterval(cycle);
                    this.lock = true;
                    notification.close('wsReconnecting');
                    notification.success({
                        message: 'WebSocket',
                        description: 'WebSocket重连成功',
                        placement: 'bottomRight',
                        duration: 4
                    });
                }else{
                    this.connect();
                }
            }, 8000);
        }
    }
}
