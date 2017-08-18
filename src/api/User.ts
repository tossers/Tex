const baseUrl: string = 'http://tex.tuling.me:81/api';

const loginUrl: string = `${baseUrl}/user/login`;

import axios from 'axios';

export async function login(userName: string, passWord: string) {
    return axios.post(loginUrl, {
        uname: userName,
        upass: passWord
    }).then((res) => {
        return res.data.token;
    }).catch((ex) => {
        throw new Error(ex.response.data.err);
    });
}