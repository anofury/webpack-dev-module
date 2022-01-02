# 基于 `Webpack 5` 与 `React 17` 的 `MPA` 开发模板

## `app.config.js` 文件
项目的配置文件，声明重要的目录路径。其中 `module.default` 表示需要构建的页面配置文件，在执行 `webpack` 构建命令时，`webpack` 目录脚本会检测该配置的正确性并自动解析出 `entry` 相关配置。

## `.entries` 文件
在成功执行 `webpack` 构建命令后，会将本次解析出的 `entry` 配置保存至该文件，仅供参考。

## 构建脚本
|  命令            | 适用场景/环境                           |
|------------------|----------------------------------------|
| server           | 使用 `webpack-dev-server` 开启本地服务  |
| watch-dev        | 开发环境使用，开启文件监听               |
| build-dev        | 开发环境使用                            |
| build-app-debug  | 测试环境使用，开启 `VConsole`           |
| build-app        | 测试、生产环境使用                      |

## 新建 `module`
在当前目录执行终端命令：
```bash
npm run module [module-dir]:[moduleName]
```
其中 `[module-dir]` 为 `modules` 下的 `[module]` 目录名， `[moduleName]` 为 `[module]` 文件名。可指定多级 `[module]` 目录：
```bash
npm run module [module-dir-1]:[module-dir-2]:[moduleName]
```
以上命令会自动创建 `[module]` 目录与文件名，并生成 `[module]` 配置文件，格式如下：
```json
// [moduleName].json
{
	"chunks": [
		"moduleName.js"
	],
	"title": "module-name",
	"htmlname": "module_name.html",
	"template": "default.html"
}
```
如需在创建 `modules` 时自动创建样式表文件，使用 `--need-style` 参数：
```bash
npm run module [module-dir]:[moduleName] --need-style
```

## 新建 `component`
在当前目录执行终端命令：
```bash
npm run comp [comp-dir]:[CompName]
```
其中 `[comp-dir]` 为 `components` 下的 `[component]` 目录名， `[CompName]` 为 `[component]` 文件名，会自动创建样式表文件。

