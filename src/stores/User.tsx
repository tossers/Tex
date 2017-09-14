import {action, observable} from 'mobx';
import {login,isLogin as isLoginFn, recharge} from '../api/Index';
export class User {
    @observable isLogin: boolean = false;

    @observable uid: string;

    @observable token: string;

    @observable nickName:string;

    @observable assetsId: number;

    @observable rechargeMoney: number = 1;

    @observable onRecharge: boolean = false;

    @action
    setOnRecharge(flag: boolean){
        this.onRecharge = flag;
    }

    @action
    changeRechargeMoney(money: number){
        this.rechargeMoney = money;
    }

    @action
    async recharge(){
        // if(this.rechargeMoney <= 0){
        //     throw new Error('金额必须大于0');
        // }
        return recharge(this.rechargeMoney).then((url) => {
            this.onRecharge = true;
            window.open(url);
        });
    }

    @action
    async login(userName: string, passWord: string) {
        return login(userName, passWord).then((data: {token: string; userAssetsId: number})  => {
            // console.log('this', this)
            this.isLogin = true;
            this.token = data.token;
            this.uid = data.token;
            this.nickName = data.token;
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
}

export default new User();