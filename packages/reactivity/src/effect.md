target 代理对象
key  操作的属性
value 值

targetMap  WeakMap；depMap  WeakMap；dep  这三个用于依赖收集和触发更新
targetMap 的key是target
    value: depMap，一个Map
        depMap的key是响应式数据在effect中被使用的key
            value: dep，一个Set
            dep：一个Set，存储当前被使用的key所在的effect,简单来说就是记录在哪儿被使用了