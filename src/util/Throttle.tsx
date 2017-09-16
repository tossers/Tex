export class Throttle{
    timer;
    start;
    delay;
    applyTime;
    fn;

    constructor(delay: number, applyTime: number, fn: (...restOfName: number[])=> void){
        this.delay = delay;
        this.applyTime = applyTime;
        this.fn = fn;
    }

    run(){
        if (this.timer) {
            clearTimeout(this.timer);
        }

        let cur = Date.now();                   //记录当前时间

        if (!this.start) {                      //若该函数是第一次调用，则直接设置_start,即开始时间，为_cur，即此刻的时间
            this.start = cur;
        }

        if (cur - this.start > this.applyTime) {
            //当前时间与上一次函数被执行的时间作差，与mustApplyTime比较，若大于，则必须执行一次函数，若小于，则重新设置计时器
            this.start = cur;
            this.fn();
        } else {
            this.timer = setTimeout(() => {
                this.fn();
            }, this.delay);
        }
    }
}