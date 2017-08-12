import {observable, action, computed} from 'mobx'

export default class Demo {

    @observable times = 0;

    @action
    addTime() {
        this.times += 10;
    }

    @action
    addTimeAync() {
        setTimeout(() => {
            this.times += 10;
        }, 1000)
    }

    @action
    subTime() {
        this.times -= 10;
    }

    @computed
    get timeStr() {
        return ("0000" + this.times).substr(-4)
    }

}