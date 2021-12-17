# 基于 `Webpack 5` 与 `React 17` 的 `MPA` 开发模板

## `app.config.js` 文件
项目的配置文件，声明重要的目录路径。其中 `page.items` 表示需要构建的页面配置文件，在执行 `webpack` 构建命令时，`webpack` 目录脚本会检测该配置的正确性并自动解析出 `entry` 相关配置。

## `.entrycache` 文件
在成功执行 `webpack` 构建命令后，会将本次解析出的 `entry` 配置保存至该文件，仅供参考。

## 构建脚本
|  命令            | 适用场景/环境                           |
|------------------|----------------------------------------|
| server           | 使用 `webpack-dev-server` 开启本地服务  |
| watch-dev        | 开发环境使用，开启文件监听               |
| build-dev        | 开发环境使用                            |
| build-app-debug  | 测试环境使用，开启 `VConsole`           |
| build-app        | 测试、生产环境使用                      |

## 新建 `page`
在当前目录执行终端命令：
```bash
npm run page [page-dir]:[pageName]
```
其中 `[page-dir]` 为 `pages` 下的 `[page]` 目录名， `[pageName]` 为 `[page]` 文件名。可指定多级 `[page]` 目录：
```bash
npm run page [page-dir-1]:[page-dir-2]:[pageName]
```
以上命令会自动创建 `[page]` 目录与文件名，并生成 `[page]` 配置文件，格式如下：
```json
// [pageName].json
{
	"chunks": [
		"pageName.js"
	],
	"title": "page-name",
	"htmlname": "page_name.html",
	"template": "default.html"
}
```
如需在创建 `pages` 时自动创建样式表文件，使用 `--need-style` 参数：
```bash
npm run page [page-dir]:[pageName] --need-style
```

## 新建 `component`
在当前目录执行终端命令：
```bash
npm run comp [comp-dir]:[CompName]
```
其中 `[comp-dir]` 为 `components` 下的 `[component]` 目录名， `[CompName]` 为 `[component]` 文件名，会自动创建样式表文件。

