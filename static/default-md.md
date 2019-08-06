使用时请替换成你的内容

式样可以通过CSS调节

为了方便下次使用可以导出CSS文件

**刷新页面会造成数据丢失**

**图片**等多媒体请在公众号编辑器中插入

更多内容请关注 **「伪装程序大佬」**

## CSS
请用**单引号**,如
```css
p {
    font-family: 'PingFang SC';
}

```

## Markdown 语法
下面只列了一些基本语法，更多语法请参考[showdown.js](https://github.com/showdownjs/showdown)

### 标题


# 一级标题 （渲染成`<h1>`）
## 二级标题 （渲染成`<h2>`）
### 三级标题 （渲染成`<h3>`）

...

以此类推



### 普通文字
直接写出来就是普通文字，会被渲染成`<p>`标签

两个换行符进入下一段

可以加上*斜体*`<em>`和**粗体**`<strong>`

### 代码

代码块

复制到公众号编辑器以后点击一下就可以根据语言高亮

```python
print("Hello World!")

def add(a, b):
    return a+b
```

内联代码 `{code:0}`


### 列表

渲染成`<li>`

其实有`<ul><ul>`和`<ol><ol>`之间的`<li>`区别，但是我
没想好怎么处理，暂时在CSS里都用`<li>`控制。


- 第一项
- 第二项
- 第三项

<br>

1. banana
2. apple
2. pear

### 表格
`<table>`, `<tr>`, `<td>`, `<th>` 

| Header 1 | Header 2 |
| --- | --- |
| Key 1 | Value 1 |
| Key 2 | Value 2 |
| Key 3 | Value 3 |

### 链接
链接会加上角标，具体网页地址会在最后加上一个Reference部分
[showdown.js](https://github.com/showdownjs/showdown)

