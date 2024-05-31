
// （1） 在视图中获取数据，触发get收集effect  （2）修改数据触发set，执行effect -- 类似于watch
// （3） 执行effect时，会触发get收集依赖，然后执行视图更新
export function effect(fn, options: any = {}){
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect()  // 立即执行
  }
  return effect;
}
let uid = 0;
let activeEffect; // 保存当前正在执行的effect
const effectStack = []; // 收集effect
// 创建effect
function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    // 如果effectStack中存在当前effect，说明是嵌套的effect，不做处理；否则入栈。
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect); // 收集effect
        activeEffect = effect; // 保存当前effect
        fn();
      } finally { // 执行完effect后，出栈
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  }
  effect.id = uid++; // 区别不同的effect，触发effect更新视图是一一对应的，需要做唯一的标识
  effect._isEffect = true; // 标识是effect,区分是不是响应式
  effect.raw = fn; // 原始函数
  effect.options = options; // 保存用户的配置
  return effect;
}

/*  
  问题：1、effect是一个树形结构，里面可以进行嵌套，如何收集effect？
      effect(() => {
      console.log(state.name) // 收集的effect1
      effect(() => {
        state.age // 收集effect2
      })
      state.age // 收集的effect1  
  问题2：effect1重复收集，如何解决？
      state.age ++ ;// 收集effect1  
    })
  答：
    1：用栈结构
    2：入栈前判断是否已经存在
*/
let targetMap = new WeakMap(); // 保存target和key的对应关系
// 收集依赖
export function Track(target, type, key) {
  // 对应的key -> key和effect一一对应  map => key = target => 属性 =》[effect]
  // 没有在effect中收集依赖，不做处理
  if (activeEffect == undefined) return
  /*
    获取effect的依赖收集容器 {target值：dep--map结构}
    targetMap用于判断当前target是否被收集，
    如果被收集则target作为属性，值是map结构；这个map结构的key是当前属性，代表我用到了哪些属性，值代表当前target的key依赖了哪些effect 
    若未被收集则逐层创建
  */
  //判断是否收集过，收集过的就不收集了；
  let depMap = targetMap.get(target);
  if (!depMap) {
    // 首次进来肯定没有收集过，需要创建
    targetMap.set(target, depMap = new Map()); // 添加target
  }
  // 有值获取key的依赖收集容器
  // 被使用的key是否被收集了，收集过的就不收集了；
  let dep = depMap.get(key);
  if (!dep) {
    // 使用key，第一次收集过，需要创建；采用Set是因为可以去重，避免数组格式导致的key重复
    depMap.set(key, dep = new Set()); // 添加key
  }
  // 收集依赖，将当前effect收集到dep中
  if (!dep.has(activeEffect)) dep.add(activeEffect);
}
export function Trigger(target, type, key?, newValue?, oldValue?) {
  console.log(target, type, key, newValue, oldValue)
  // targetMap是用于收集effect的，targetMap是target和depMap一一对应的关系
  const depMap = targetMap.get(target);
  // 目标对象没有被effect收集，不做处理
  if (!depMap) return;
  // 被收集
  // 目标对象有没有这个属性，在Set里面找
  let effectSet = new Set();
  const add = (effectAdd) => {
    if (effectAdd) { 
      effectAdd.forEach(effect => effectSet.add(effect))
    }
  }
  // 获取当前属性effect集合
  add(depMap.get(key))
  effectSet.forEach((effect:any) => {
    effect();
  })
  // let effects = depMap.get(key);
  // if (!effects) {
    
  // }
  // 如果有对应的key，则执行对应的effect
}