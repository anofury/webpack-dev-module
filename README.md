# 脚手架设计

## 执行 entry.creator.js 按设定模板创建入口文件

-   命令行支持参数

```bash
npm run new-entry -- --name "about-me" --title "关于我" --htmlname "about_me" --template "template" --author "anofury"
npm run new-entry -- -n "about-me" -t "关于我"
# 推荐
npm run new-entry "about-me" "关于我"
```

-   name 自动转化
-   entry 兼容 `.jsx`

| name     | folder   | entry      | htmlname（缺省值）  |
| -------- | -------- | ---------- | ------------------ |
| about    | about    | about.js   | about.html         |
| about-me | about-me | aboutMe.js | about_me.html      |
| aboutMe  | about-me | aboutMe.js | about_me.html      |

-   filename 使用小写字母、下划线、数字组成，禁止数字开头

-   入口文件模板

```javascript
// ${USER}缺省值：require("os").hostname()

/*
 * Created by ${USER} on ${DATE}
 * title: 关于我
 * htmlname: about_me
 * template: template
 */
```

## 使用 fs 模块读取目录结构并自动设置 HtmlWebpackPlugin 的 title、template、chunks、filename 参数

## 对于 filename 一样的入口文件，合并到同一个 chunks，并按入口文件名顺序使用第一个入口文件名的配置
