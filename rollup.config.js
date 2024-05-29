import ts from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import resolvePlugin from '@rollup/plugin-node-resolve' // 解析第三方插件
import path from 'path'
// 获取打包文件路径
let packagesDir = path.resolve(__dirname, 'packages')
// 获取需要的包
let packageDir = path.resolve(packagesDir, process.env.TARGET)
// 获取包的项目配置
let resolve = p => path.resolve(packageDir, p);
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}
const name = packageOptions.filename || path.basename(packageDir);

// 创建映射表
const outputOptions = {
  "esm-bundler": {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: 'es'
  },
    "cjs": {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs'
  },
  "global": {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife'
  }
}
// 
const options = pkg.buildOptions
function createConfig(format,output) {
  // 编译打包
  output.name = options.name;
  output.sourcemap = true;
  // 生成rollup配置
  return {
    input: resolve('src/index.ts'), // 导入
    output,
    plugins: [
      json(),
      ts({
        tsconfig:path.resolve(__dirname,'tsconfig.json')// 解析ts
      }),
      resolvePlugin() // 解析第三方插件
    ]
  }
}
// 导出配置
export default options.formats.map(format => createConfig(format, outputOptions[format]));