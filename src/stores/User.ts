import {action, observable} from 'mobx';

export class User {
    @observable isLogin:boolean;

    @observable uid:string;

    @action
    async login(userName:string,passWord:string) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // reject(new Error('xxxx'));
                this.isLogin = true;
                this.uid = userName;
                resolve();
            }, 1000);
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