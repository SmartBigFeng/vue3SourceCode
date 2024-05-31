<!--
 * @Author: 开发_王锋 wangfeng@vrgvtech.com
 * @Date: 2024-05-29 14:56:20
 * @LastEditors: 开发_王锋 wangfeng@vrgvtech.com
 * @LastEditTime: 2024-05-29 14:58:38
 * @FilePath: \ToG平台Web端-前端f:\CodeDemo\Vue\Vue3\vue3SourceCode\e.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
打包：
格式  自定义

源码使用了高阶函数，有点儿类似于柯里化，但是柯里化是固定参数的，高阶函数是可变参数的。
重点关注：
  1. 结构的处理
  2. 设计模式


关于effect，track和trigger的简介与作用
    reactive是Vue3中响应式系统的核心，它通过effect、track和trigger三个函数来实现响应式数据的跟踪和更新。--->响应式核心--proxy
  effect(fn, options):
    effect函数用于创建一个响应式效果（或称为“副作用”），它接受一个函数fn作为参数，这个函数包含了需要响应式跟踪的代码。
    当fn函数内部访问的响应式数据发生变化时，effect会重新运行fn函数，以确保视图或相关逻辑保持最新。
    options参数可用于配置副作用的行为，如延迟执行、错误处理等。

  track(target, type, key):
    track函数用于跟踪响应式数据的依赖关系。
    当在effect函数内部访问某个响应式数据时，track会被调用以记录当前副作用依赖于哪些数据。
    target是响应式对象，type表示操作的类型（如“get”表示获取属性），而key表示被访问的具体属性或键。

  trigger(target, type, key, newValue, oldValue, oldTarget):
    trigger函数用于触发响应式数据的更新。
    当响应式数据发生变化时，trigger会被调用以通知所有依赖于该数据的副作用重新执行。
    它接受与track类似的参数，以及新值和旧值，用于描述数据的变化。
    在Vue 3的实际使用中，开发者通常不会直接调用这些函数，而是通过使用ref、reactive等API来创建和管理响应式数据。Vue的内部机制会自动处理effect、track和trigger的调用，以确保响应式系统的正常工作。

  简而言之，effect用于定义和执行副作用，track用于建立数据依赖关系，而trigger则用于在数据变化时触发副作用的重新执行。