/*
 * @Author: 开发_王锋 wangfeng@vrgvtech.com
 * @Date: 2024-05-29 14:55:28
 * @LastEditors: 开发_王锋 wangfeng@vrgvtech.com
 * @LastEditTime: 2024-05-29 16:44:16
 * @FilePath: \ToG平台Web端-前端f:\CodeDemo\Vue\Vue3\vue3SourceCode\scripts\build.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 进行打包 -- monorepo
// （1）获取打包目录
// 注意-只打包文件夹
const execa = require('execa')
// (2) 并行打包
async function build(target) {
  await execa("rollup", ["-cw", "--environment", `TARGET:${target}`], {
    stdio: "inherit",
  }) 
}
build('reactivity')