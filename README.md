# md2html with CSS
An online tool to convert markdown to html
[https://oliwang.github.io/md2html/index.html](https://oliwang.github.io/md2html/index.html)

## 简介
我写公众号文章一直觉得排版很麻烦。

如果直接在公众号编辑器里写思路常常会被打断，因为总觉得写一段就要设置字号，颜色，对齐方式什么的。

在本地编辑器里写完复制再改格式也很头疼，点来点去，一不小心弄乱了格式又要重来。

想用markdown，但是渲染后的结果复制到编辑器里要么消失，要么和原来不太一样。

我搜来搜去看到有程序员写过很棒的在线版网页工具

- [Markdown-Weixin](https://md.qikqiak.com)

- [WeChat-Format](https://lab.lyric.im/wxformat/)

可惜我的公众号有自己的配色习惯，这两个页面上面对于颜色，格式，字体可以自定义的范围都比较小。
找来找去再没找到合适的，干脆自己写一个吧。

就有了这个**Markdown2HTML with CSS**

## 特点
- 支持Markdown
- **可以通过CSS改变渲染出来的结果**
- 支持代码
- 将超链接的链接作为reference附在文章最后
- 可以下载保存修改后的markdown和css文件
- 一键复制

## 用到的库
 - Vue
 - Element-UI
 - showdown.js
 - axios.js
 - jquery
 - CodeMirror
 
## 目前的一些问题
1. 加载时间实在太长
2. 在ipad上不知道为什么没办法输入中文
3. scroll时灵时不灵

## 联系我
如果你有什么建议（比如怎么解决上面的问题）或者使用的时候有什么想法欢迎告诉我～

关注微信公众号「伪装程序大佬」
![公众号二维码](./static/img/qr.png)



## 感谢

灵感和部分代码来自[WeChat-Format](https://lab.lyric.im/wxformat/)