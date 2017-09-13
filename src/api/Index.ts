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

const adjustLeverageUrl: string = `${baseUrl}/position/leverage`;   //调整杠杆

const adjustBondUrl: string = `${baseUrl}/position/transferMargin`; //调整保证金

const dealOrderUrl: string = `${baseUrl}/dealOrder`;                //获取成交单

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

export

    /**
     * 状态码校验
     * @param status
     * @returns {boolean}
     */
const validateStatus = (status) => {
        if (status === 401) {
            if (lock) {
                lock = false;
                message.error('token失效，请重新登录');
                setTimeout(() => {
                    window.history.pushState({}, '', '/');
                }, 2000);
            }
            return false;
        }
        return status >= 200 && status < 300; // default
    };

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

export async function isLogin() {
    return axios.get(isLoginUrl, {params: {token: temp.token}}).then((res) => {
        return res.data;
        // console.log("===>",token);
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
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
    const orderType = type === 'buy' ? 1 : 2;
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
            token:temp.token
        }
    }).catch((ex) => {
        throw new Error(ex.response.data);
    });
}