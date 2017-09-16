import axios from 'axios';
import {message} from 'antd';

const registerHost: string = 'http://user.cavacn.com:3000/api/user';

const baseUrl: string = 'http://tex.tuling.me:81/api';

const loginUrl: string = `${baseUrl}/user/login`;

const loginOutUrl: string = `${baseUrl}/user/logout`;

const identityUrl: string = `${baseUrl}/user/identity`;        //提交身份验证

const productUrl: string = `${baseUrl}/product`;

const isLoginUrl: string = `${baseUrl}/user/checkToken`;

const orderUrl: string = `${baseUrl}/order`;

const getPositionListUrl: string = `${baseUrl}/position`;           //获取持仓列表接口

const userAssetsUrl: string = `${baseUrl}/userAssets/my`;           //获取资金账户接口

const adjustLeverageUrl: string = `${baseUrl}/position/leverage`;   //调整杠杆

const adjustBondUrl: string = `${baseUrl}/position/transferMargin`; //调整保证金

const dealOrderUrl: string = `${baseUrl}/dealOrder`;                //获取成交单

const rechargeUrl: string = `${baseUrl}/recharge`;                  //获取成交单

const sendMessageUrl: string = `${registerHost}/sendsms`;           //发送短信验证码

const registByPhoneUrl: string = `${registerHost}/registbyphone`;   //手机注册

let lock: boolean = true;

// let token: string = '';

let temp = {token: ''};

Object.defineProperty(temp, 'token', {
    get: function () {
        return localStorage.getItem('token');
    },
    set: function (value: string) {
        localStorage.setItem('token', value);
    }
});

/**
 * 状态码校验
 * @param status
 * @returns {boolean}
 */
const validateStatus = (status) => {
    if (status === 401) {
        if (lock) {
            temp.token = '';
            lock = false;
            message.error('token失效，请重新登录');
            // setTimeout(() => {
            //     window.location.pathname = '/';
            // }, 2000);
        }
        return false;
    }
    return status >= 200 && status < 300; // default
};

/**
 * 上传身份证
 * @param {string} identityId
 * @param {string} name
 * @param {string} topper
 * @param {string} under
 * @returns {Promise<never | AxiosResponse>}
 */
export async function identityCheck(id: string, name: string, topper: string, under: string){
    return axios.post(identityUrl, {
        id,
        name,
        topper,
        under,
    },{
        validateStatus,
        headers: {
            token: temp.token
        }
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

/**
 * 获取身份证验证状态
 * @param {string} identityId
 * @param {string} name
 * @param {string} topper
 * @param {string} under
 * @returns {Promise<never | AxiosResponse>}
 */
export async function identityCheckStatus(){
    return axios.get(identityUrl, {
        validateStatus,
        headers: {
            token: temp.token
        }
    }).then((res) => {
        return res.data;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

/**
 * 发送短信验证码
 * @param {number} phone
 * @returns {Promise<void>}
 */
export async function sendMessage(phone: string){
    return axios.get(sendMessageUrl, {
        validateStatus,
        params: {
            phone,
            method: 'regist',
            company: '粒氏集团',
            iou: 1,
        }
    }).then((res) => {
        return res.data.result;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

/**
 * 手机注册
 * @param {number} id
 * @param {string} upass
 * @param {number | string} code
 * @returns {Promise<never | AxiosResponse>}
 */
export async function registByPhone(id: number, upass: string, code: number | string){
    return axios.get(registByPhoneUrl, {
        params: {
            method: 'regist',
            id,
            upass,
            repass: upass,
            iou: 1,
            code,
        }
    }).then((res) => {
        return res.data.code;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

/**
 * 充值
 * @param money
 * @returns {Promise<TResult|TResult2|TResult1>}
 */
export async function recharge(money: number){
    return axios.post(`${rechargeUrl}/${money}`, {}, {
        validateStatus,
        headers: {
            token: temp.token
        }
    }).then((res) => {
        return res.data;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

/**
 * 获取成交单
 * @param page
 * @param size
 * @returns {Promise<TResult|TResult2|TResult1>}
 */
export async function getDealOrders(page: number) {
    return axios.get(`${dealOrderUrl}/${page}/100`, {
        validateStatus,
        headers: {
            token: temp.token
        }
    }).then((res) => {
        return res.data;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

/**
 * 调整保证金
 * @param productId
 * @param amount
 * @returns {Promise<TResult|AxiosResponse>}
 */
export async function postBond(productId: number, amount: number) {
    return axios.patch(`${adjustBondUrl}/${productId}/${amount}`, {}, {
        validateStatus,
        headers: {
            token: temp.token
        }
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

/**
 * 调整杠杆
 * @param productId
 * @param lever
 * @returns {Promise<TResult|AxiosResponse>}
 */
export async function patchLeverage(productId: number, lever: number) {
    return axios.patch(`${adjustLeverageUrl}/${productId}/${lever}`, {}, {
        validateStatus,
        headers: {
            token: temp.token
        }
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

/**
 * 校验token
 * @returns {Promise<never | AxiosResponse>}
 */
export async function isLogin() {
    if(temp.token){
        return axios.get(isLoginUrl, {params: {token: temp.token}}).then((res) => {
            return res.data;
            // console.log("===>",token);
        }).catch((ex) => {
            throw new Error(ex.response.data);
        });
    }else {
        temp.token = '';
        throw new Error('token为空');
    }
}

export async function login(userName: string, passWord: string) {
    return axios.post(loginUrl, {
        uname: userName,
        upass: passWord,
    }).then((res) => {
        temp.token = res.data.token;
        return res.data;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

export async function getProducts() {
    return axios.get(productUrl).then((res) => {
        return res.data;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

export async function entrust(type: string, productId: string, price: number, quantity: number, lever: number) {
    const orderType = type === 'buy' ? 1 : -1;
    return axios.post(orderUrl, {
        lever,
        type: orderType,
        price,
        quantity,
        productId,
    }, {
        validateStatus,
        headers: {
            token: temp.token
        }
    }).then((res) => {
        return res.data.list;
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

export async function delEntrust(entrustId: number) {
    return axios.delete(`${orderUrl}/${entrustId}`, {
        validateStatus, headers: {
            token:temp.token
        }
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}

/**
 * 获取委托列表
 * @param currPage
 * @returns {Promise<TResult|TResult2|TResult1>}
 */
export async function entrusts(currPage: number) {
    return axios.get(orderUrl, {
        validateStatus,
        params: {
            token: temp.token,
            pageSize: 100,
            currPage,
        }
    }).then((res) => {
        return res.data;
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
            token:temp.token
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
export async function getPositionList(currPage?: number, pageSize?: number, filter?: string, orderBy?: string) {
    return axios.get(getPositionListUrl, {
        validateStatus,
        params: {
            currPage,
            pageSize,
            filter,
            orderBy,
        },
        headers: {
            token:temp.token
        }
    }).then((res) => {
        return res.data;
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
    return axios.delete(getPositionListUrl + '/' + id, {
        validateStatus,
        headers: {
            token:temp.token
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
            token:temp.token
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
            token: temp.token
        }
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}