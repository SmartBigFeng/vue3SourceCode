/*
 * @Author: 开发_王锋 wangfeng@vrgvtech.com
 * @Date: 2024-05-29 14:55:28
 * @LastEditors: 开发_王锋 wangfeng@vrgvtech.com
 * @LastEditTime: 2024-05-29 16:41:00
 * @FilePath: \ToG平台Web端-前端f:\CodeDemo\Vue\Vue3\vue3SourceCode\scripts\build.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 进行打包 -- monorepo
// （1）获取打包目录
// 注意-只打包文件夹
const fs = require('fs');
const execa = require('execa')
const dirs = fs.readdirSync('packages').filter(p =>
  fs.statSync(`packages/${p}`).isDirectory()
)
// (2) 并行打包
async function build(target) {
  await execa("rollup", ["-C", "--environment", `TARGET:${target}`], {
    stdio: "inherit",
  }) // 子进程的输出在父包中输出
}
async function runParallel(_dirs, _fn) {
  let result = []
  for (let item of _dirs) {
    result.push(_fn(item));
  }
  return Promise.all(result); // 存放打包promise，等待打包执行完毕调用resolve
}
runParallel(dirs, build).then(() => {
  console.log("打包完成")
})