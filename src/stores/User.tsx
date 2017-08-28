import {action, observable} from 'mobx';
import {login} from '../api/Index';

export class User {
    @observable isLogin: boolean = false;

    @observable uid: string;

    @observable token: string;

    @observable nickName:string;

    @observable assetsId: number;

    @action
    async login(userName: string, passWord: string) {
        return login(userName, passWord).then((data: {token: string; userAssetsId: number})  => {
            this.isLogin = true;
            this.token = data.token;
            this.uid = data.token;
            this.nickName = data.token;
            this.assetsId = data.userAssetsId;
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