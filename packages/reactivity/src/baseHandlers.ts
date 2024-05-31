/*
 * @Author: 开发_王锋 wangfeng@vrgvtech.com
 * @Date: 2024-05-31 09:46:59
 * @LastEditors: 开发_王锋 wangfeng@vrgvtech.com
 * @LastEditTime: 2024-05-31 16:24:56
 * @FilePath: \ToG平台Web端-前端f:\CodeDemo\Vue\Vue3\vue3SourceCode\packages\reactivity\src\baseHandlers.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  isObject, isArray, extend, hasChanged, isString,
  isSymbol, isUndefined, isNull, hasOwn, isInteger
} from '@vue/shared';
import { reactive, readonly } from './reactive';
import { TrackOpTypes, TriggerOpTypes } from './operations'
import {Track, Trigger} from './effect'
function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key, receiver) {
    /* 
      state =  reactive({
        name:"Acc",
        args:{
          time: "2099-12-13"
        }
      })
    */
    const res = Reflect.get(target, key, receiver);
    // 不是只读
    if (!isReadonly) { 
      // 收集依赖
      Track(target, TrackOpTypes.GET, key);
    }
    if (isShallow) { // 浅层收集依赖
      return res;
    }
    // key是对象需要做递归 在vue3里面，如果没使用state.args，就不会对args做代理，这算是一个性能优化
    /* 
      vue3性能优化-懒代理
      如果没有使用到某个属性，vue3就不会对这个属性进行代理
    */
    if (isObject(res)) { 
      return isReadonly ? readonly(res) : reactive(res);
    }
    
    return res;
  };
}
const get = createGetter(); // 非只读，且深度代理
const shallowGet = createGetter(false, true); // 非只读，浅层代理
const readonlyGet = createGetter(true); // 只读，深度代理
const shallowReadonlyGet = createGetter(true, true); // 浅层只读
// 
function createSetter(isShallow = true) {
  return function set(target, key, value, receiver) {
    // 触发依赖更新
    // 注意1：这里不能使用target[key] = value，因为target[key]是代理对象，而value是原始值
    /*
      注意2：是数组还是对象？
      注意3：是添加还是修改？ 

      对于数组而言，key是字符串化的索引
      */
     //  1、首先获取旧的值
    const oldValue = target[key];    
    const res = Reflect.set(target, key, value, receiver); // 获取最新的值
    // 判断是否有这个key？ 数组：索引小于长度即可，对象：判断是否有这个key
    let hasKey = isArray(target) && isInteger(key) ? Number(key) < target.length : hasOwn(target, key);
    if (!hasKey) {
      //  2、然后判断是否是数组
      Trigger(target, TriggerOpTypes.ADD, key, value);
    } else {
      // 修改的时候如果新旧值一样，就不触发依赖更新
      if (hasChanged(value, oldValue)) {
        Trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
    }
    return res;
  }
  
}
const set = createSetter();
const shallowSet = createSetter(true);
let readonlySet = {
  set: (target, key, value) => {
    console.log(`set ${value} on key ${key} is faild`)
  },
}
export const reactiveHandlers = {
  get,
  set
}
export const shallowReactiveHandlers={
  get: shallowGet,
  set: shallowSet
}
export const readonlyHandlers= {
  get: readonlyGet,
  set: (target, key, value) => {
    console.error(`set ${value} on key ${key} is faild`)
  },
}
export const shallowReadonlyHandlers= extend({
  get: shallowReadonlyGet
}, readonlySet)

/* 
  面试题： reactive   ref
  reactive: 
    1、通过proxy实现
    2、懒代理，数据可能嵌套多层，只有用到的时候才会代理--会起到性能优化的作用
    3、readonly只读：数据不需要更新可以使用
    4、通过effect收集依赖，通过trigger触发更新



  区别：
    用途：
      ref 主要用于处理基本数据类型（如字符串、数字、布尔值等）。当你使用 ref 创建一个响应式引用时，它返回一个包装对象，该对象具有一个 value 属性来存储实际的值。这允许 Vue 跟踪基本数据类型的变化。
      reactive 主要用于处理对象或数组。它返回一个原始对象的响应式代理，允许你直接访问和修改对象的属性。

    解包/访问值：

      使用 ref 创建的响应式引用在模板中会自动解包，所以你可以直接使用值而不是 .value。但在 JavaScript 代码（如 setup 函数）中，你需要通过 .value 来访问或修改引用的值。
      使用 reactive 创建的对象或数组在模板和 JavaScript 代码中都可以直接访问和修改其属性，无需额外的解包步骤。

    返回值：
      ref 返回一个包装对象，具有一个 value 属性。
      reactive 返回原始对象的代理。

    数组和对象方法：
      对于通过 ref 创建的数组或对象，Vue 不会使其方法（如 push、splice 等）变得响应式。如果你需要这些方法变得响应式，你应该使用 reactive。
*/