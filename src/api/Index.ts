const baseUrl: string = 'http://tex.tuling.me:81/api';

const loginUrl: string = `${baseUrl}/user/login`;

const productUrl: string = `${baseUrl}/product`;

const orderUrl: string = `${baseUrl}/order`;

import axios from 'axios';

let token: string = '';

export async function login(userName: string, passWord: string) {
    return axios.post(loginUrl, {
        uname: userName,
        upass: passWord
    }).then((res) => {
        token = res.data.token;
        return res.data.token;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

export async function getProducts() {
    return axios.get(productUrl).then((res) => {
        return res.data.list;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

export async function entrust(type: string, productId: string, price: number, quantity: number) {
    const orderType = type === 'buy' ? 1 : 2;
    return axios.post(orderUrl, {
        lever: 1,
        orderType,
        price,
        quantity,
        productId,
        status: 1
    }, {
        headers: {
            token: token
        }
    }).then((res) => {
        return res.data.list;
    }).catch((ex)=>{
        throw new Error(ex.response.data);
    });
}

export async function getOrder(pageNum: string | number, pageSize: string | number) {
    return axios.get(orderUrl, {
        params: {
            pageNum,
            pageSize
        },
        headers: {
            token
        }
    }).then((res) => {
        return res.data.list;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}