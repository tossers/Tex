import {observable, action} from 'mobx'

export default class User {

    @observable isLogin;

    @action
    async login(userName: string, userPass: string) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.isLogin = true;
                return resolve(this.isLogin);
            }, 1000)
        });
    }

    @action
    async logout() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.isLogin = false;
                return resolve(this.isLogin);
            }, 1000)
        });
    }

}