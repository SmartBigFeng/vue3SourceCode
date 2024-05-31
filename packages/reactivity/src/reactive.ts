import { isObject } from "@vue/shared";
import { reactiveHandlers, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers } from "./baseHandlers";


export function reactive(target) {
  return createReactObj(target, false, reactiveHandlers);
}
export function shallowReactive(target) {
  return createReactObj(target, true, shallowReactiveHandlers);
}
export function readonly(target) {
  return createReactObj(target, false, readonlyHandlers);
}
export function shallowReadonly(target) {
  return createReactObj(target, false, shallowReadonlyHandlers);
}
// 实现代理
// 优化：只代理一次，后面直接返回
const reactiveMap = new WeakMap(); // key: 对象  value: 代理对象  会自动垃圾回收，不会导致内存泄漏
const readonlyMap = new WeakMap(); 
function createReactObj(target, readonly, baseHandlers){
  // 公共的方法放在shared中
  if (!isObject(target)) return target;
  const proxyMap = readonly ? readonlyMap : reactiveMap;
  if (proxyMap.has(target)) return proxyMap.get(target);
  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
// 是不是只读的，是不是深度代理
// 核心proxy， 源码中柯里化：根据不同的参数