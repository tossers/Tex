
/**
 * 根据字段正序排列
 * @param a
 * @param b
 * @returns {number}
 */
export function sortBy(key: string){
    return (a, b) => {
        return (b[key] - a[key]);
    };
}
// /**
//  * 根据价格正序排列
//  * @param a
//  * @param b
//  * @returns {number}
//  */
// export function sortWithPrice(a: {price: number}, b: {price: number}){
//     return  (b.price - a.price);
// }
// /**
//  * 根据时间正序排列
//  * @param a
//  * @param b
//  * @returns {number}
//  */
// export function sortWithTime(a: {time: number}, b: {time: number}){
//     return  (b.time - a.time);
// }

/**
 * 保留小数
 * @param a
 * @param b
 * @returns {string|number}
 */
export function toFixed(a: number, b: number){
    return typeof(a) === 'number'? a.toFixed(b).replace(/\B(?=(\d{3})+(?!\d))/g, ','): 0;
}
