/**
 * Created by YCY on 2017/8/24.
 */
const webSocketUrl = 'ws://tex.tuling.me:8089/websocket'
export const ws = new WebSocket(webSocketUrl);

ws.onopen = () => {
    // Web Socket 已连接上
    console.log("ws数据已连接");
};
ws.onclose = () => {
    // 关闭 websocket
    console.log("ws连接已关闭...");
};

ws.onmessage = (evt) => {
    const received_msg = JSON.parse(evt.data);
    console.log("ws数据已接受");
    console.log(received_msg);
    if (received_msg.cmd === 'orderBook') {

    }else if(received_msg.cmd === 'trade'){

    }else if(received_msg.cmd === 'min'){
        received_msg.data.forEach((item) => {

        })
    }else if(received_msg.length > 0){
        received_msg.forEach((obj) => {
            if(obj.cmd === 'orderBook'){

            }else if(obj.cmd === 'trade'){

            }else if(obj.cmd === 'min'){

            }
        })
    }
}

export const wsSubscribe = (id) => {
    ws.send(JSON.stringify({"op": "subscribe", "args": [`orderBook:${id}`, `trade:${id}`, `min:${id}`]}));
};

export const wsUnsubscribe = (id) => {
    ws.send(JSON.stringify({"op": "unsubscribe", "args": [`orderBook:${id}`, `trade:${id}`, `min:${id}`]}))
};
