import axios from 'axios';
import {message} from 'antd';

const baseUrl: string = 'http://tex.tuling.me:81/api';

const loginUrl: string = `${baseUrl}/user/login`;

const loginOutUrl: string = `${baseUrl}/user/logout`;

const productUrl: string = `${baseUrl}/product`;

const isLoginUrl: string = `${baseUrl}/user/checkToken`;

const orderUrl: string = `${baseUrl}/order`;

const getPositionListUrl: string = `${baseUrl}/position`;           //获取持仓列表接口

const userAssetsUrl: string = `${baseUrl}/userAssets/my`;           //获取资金账户接口

let lock: boolean = true;
let token: string = '';

const validateStatus = (status) => {
    if(status === 401){
        if(lock){
            lock = false;
            message.error('token失效，请重新登录');
            setTimeout(()=>{
                window.location.pathname = '/';
            }, 3000);
        }
        return false;
    }
    return status >= 200 && status < 300; // default
};

export async function isLogin(){
    const tempToken = localStorage.getItem('token');
    return axios.get(isLoginUrl,{params:{token:tempToken}}).then((res)=>{
        token = tempToken||'';
        return res.data;
        // console.log("===>",token);
    }).catch((ex)=>{
        throw new Error(ex.response.data);
    });
}

export async function login(userName: string, passWord: string) {
    return axios.post(loginUrl, {
        uname: userName,
        upass: passWord,
    }).then((res) => {
        token = res.data.token;
        localStorage.setItem('token',token);
        return res.data;
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

export async function entrust(type: string, productId: string, price: number, quantity: number, lever: number) {
    const orderType = type === 'buy' ? 1 : 2;
    return axios.post(orderUrl, {
        lever,
        orderType,
        price,
        quantity,
        productId,
        status: 1
    }, {
        validateStatus,
        headers: {
            token: token
        }
    }).then((res) => {
        return res.data.list;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

export async function delEntrust(entrustId:number){
    return axios.delete(`${orderUrl}/${entrustId}`,{validateStatus, headers:{
        token
    }}).catch((ex)=>{
        throw new Error(ex.response.data);
    });
}

export async function entrusts(productId: number) {
    return axios.get(orderUrl, {
        validateStatus,
        params: {
            token: token,
            pageSize:12,
            filter: JSON.stringify({productId})
        }
    }).then((res) => {
        return res.data.list;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

export async function getOrder(pageNum: string | number, pageSize: string | number) {
    return axios.get(orderUrl, {
        validateStatus,
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

/**
 * 获取持仓
 * @param currPage //当前页码
 * @param pageSize //单页条数
 * @param filter   //字段过滤
 * @param orderBy  //字段排序
 * @returns {Promise<TResult|TResult2|TResult1>}
 */
export async function getPositionList(currPage?: number, pageSize?: number, filter?:string, orderBy?: string) {
    return axios.get(getPositionListUrl, {
        validateStatus,
        params: {
            currPage,
            pageSize,
            filter,
            orderBy,
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

/**
 * 平仓
 * @param id   //持仓ID
 * @returns {Promise<TResult|AxiosResponse>}
 */
export async function deletePosition(id: number) {
    return axios.delete(getPositionListUrl+'/'+id, {
        validateStatus,
        headers: {
            token
        }
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

/**
 * 获取用户资金信息
 *
 * @returns {Promise<TResult|TResult2|TResult1>}
 */
export async function getUserAssets() {
    return axios.get(userAssetsUrl, {
        validateStatus,
        headers: {
            token
        }
    }).then((res) => {
        return res.data;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

/**
 * 退出登录
 * @returns {Promise<TResult|AxiosResponse>}
 */
export async function loginOut() {
    return axios.get(loginOutUrl, {
        validateStatus,
        params: {
            token
        }
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}