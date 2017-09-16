import {action, observable} from 'mobx';
import {login,isLogin as isLoginFn, recharge, identityCheck, identityCheckStatus} from '../api/Index';
export class User {
    @observable isLogin: boolean = false;

    @observable uid: string;

    @observable token: string;

    @observable name:string = 'guest';

    @observable assetsId: number;

    @observable url: string;

    @observable checkStatus: string;

    @observable topUrl: string;

    @observable underUrl: string;

    @observable identityId: string;

    @action
    async recharge(money: number){
        return recharge(money).then((url) => {
            this.url = url;
        }).catch((ex) => {
            this.url = ex.message;
        });
    }

    @action
    async login(userName: string, passWord: string) {
        return login(userName, passWord).then((data: {token: string; userAssetsId: number})  => {
            // console.log('this', this)
            this.isLogin = true;
            this.token = data.token;
            this.uid = data.token;
            this.assetsId = data.userAssetsId;
            // localStorage.removeItem('settings');
        });
    }

    @action
    isLoginFn(){
        return isLoginFn().then((data: {userAssetsId: number})=>{
            this.isLogin = true;
            this.assetsId = data.userAssetsId;
        });
    }

    @action
    logout() {
        localStorage.removeItem('token');
        this.isLogin = false;
    }

    @action
    identityCheck(identityId: string, name: string, topper: string, under: string){
        return identityCheck(identityId, name, topper, under).then(() => {
            this.name = name;
        });
    }

    @action
    identityCheckStatus(){
        return identityCheckStatus().then(result => {
            this.name = result.name || 'guest';
            this.identityId = result.id || '';
            this.checkStatus = result.status;
            this.topUrl = result.topper;
            this.underUrl = result.under;
        }).catch(() => {return ;});
    }
}

export default new User();