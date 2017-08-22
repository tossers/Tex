import {action, observable} from 'mobx';
import {login} from '../api/Index';

export class User {
    @observable isLogin: boolean = false;

    @observable uid: string;

    @observable token: string;

    @observable nickName:string;

    @action
    async login(userName: string, passWord: string) {
        return login(userName, passWord).then((token: string) => {
            this.isLogin = true;
            this.token = token;
            this.uid = token;
            this.nickName = token;
        });
    }

    @action
    async logout() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.isLogin = false;
                resolve();
            }, 2000);
        });
    }
}

export default new User();