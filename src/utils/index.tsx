/**
 * 保留小数位
 * @param a //对象或者数字
 * @param b //小数点位数
 * @returns {any}
 */
export function toFixed(a: number|object, b: number=3){
    if(typeof(a) === 'object'){
        Object.keys(a).forEach((item) => {
            if(typeof(item) === 'number'){
                a[item + ''] = parseFloat(a[item + ''].toFixed(b));
            }
        });
        return a;
    }else {
        return parseFloat(a.toFixed(b));
    }
}

