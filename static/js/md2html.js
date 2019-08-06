// var converter = new showdown.Converter(),
//     text      = '# hello, markdown!',
//     html      = converter.makeHtml(text);
//
// // console.log(html);
//
// var style = "<style>#output h1 {color:red;}</style>";


var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        visible:false,
        aboutDialogVisible:false,
        title: 'Markdown2HTML with CSS',
        editMD: true,
        md_editor:null,
        css_editor:null,
        md_source:'',
        css_source:'',
        output:null,
        converter:new showdown.Converter(),
        reference_list: [],
        reference_index: 0,
        browser_type: null

    },
    mounted: function () {
        let explorer = window.navigator.userAgent ;

        if(explorer.indexOf("Chrome") >= 0){
            this.browser_type = 'Chrome';
        }




        let self = this;
        self.md_editor = CodeMirror.fromTextArea(document.querySelector("#md_editor"), {
            lineNumbers: false,
            lineWrapping: true,
            styleActiveLine: true,
            theme: 'base16-light',
            mode: 'text/x-markdown'

        });
        self.css_editor = CodeMirror.fromTextArea(document.querySelector("#css_editor"), {
            lineNumbers: false,
            lineWrapping: true,
            styleActiveLine: true,
            theme: 'base16-light',
            mode: 'css'
        });

        self.md_editor.on("change", function(cm, change) {
            self.refresh()
        });
        self.css_editor.on("change", function(cm, change) {
            self.refresh()
        });
        axios({
            method: 'get',
            url: 'https://raw.githubusercontent.com/oliwang/md2html/master/static/default-md.md'
        }).then(function (resp) {
            self.md_editor.setValue(resp.data)
        });
        axios({
            method: 'get',
            url: 'https://raw.githubusercontent.com/oliwang/md2html/master/static/default-css.css'
        }).then(function (resp) {
            self.css_editor.setValue(resp.data)
        });

        let max_height = $(".main-section .el-col").height();
        // alert(max_height);
        // alert(max_height-30-10-30);
        $("#output").attr("style","height:" + (max_height-30-10-30) + "px;");


    },
    methods: {
        exportMarkdown: function(){
            this.exportFile("md");

        },
        exportCss: function(){
            this.exportFile("css");
        },
        exportFile:function(file_type){
            let editor_content = null;
            let filename = null;
            if (file_type === "md"){
                editor_content = this.md_editor.getValue();
                filename = "md2html.md";
            } else{
                editor_content = this.css_editor.getValue();
                filename = "md2html.css";
            }


            let content = new Blob([editor_content]);


            let urlObject = window.URL || window.webkitURL || window;
            let url = urlObject.createObjectURL(content);
            let el = document.createElement('a');
            el.href = url;
            el.download =filename;
            document.body.appendChild(el);
            el.click();
            urlObject.revokeObjectURL(url);
        },
        refresh: function () {
            const styleMap = this.generate_style_map();
            this.reference_list = [];
            this.reference_index = 0;
            const self = this;

            const link = {
                type: "output",
                regex: /<a href="([^"]+?)">([^<]+?)<\/a>/g,
                replace: function(d, link_href, link_name) {
                    self.reference_index += 1;
                    let r = '[' + self.reference_index + '] ' + link_name + ':<br>' + link_href;
                    self.reference_list.push(r);
                    let $replace_ele = $('<span>'+ link_name+'<sup>['+ self.reference_index + ']</sup></span>');
                    return $replace_ele[0].outerHTML;

                }

            };

            // const link = {
            //     type: "lang",
            //     regex: /(?<!\!)\[([^\[\]]+)\]\(([^)]+)\)/gm,
            //     replace: function(d, link_name, link_href) {
            //         self.reference_index += 1;
            //         let r = '[' + self.reference_index + '] ' + link_name + ':<br>' + link_href;
            //         self.reference_list.push(r);
            //         let $replace_ele = $('<span>'+ link_name+'<sup>['+ self.reference_index + ']</sup></span>');
            //         return $replace_ele[0].outerHTML;
            //     }
            //
            // };

            const bindings = Object.keys(styleMap)
                .map(key => ({
                    type: 'output',
                    regex: new RegExp(`<${key}>`, 'g'),
                    replace: `<${key} style="${styleMap[key]}">`
                }));


            const codeblock = {
                type: 'output',
                regex: /<pre>\s*<code class=\"([\w\-]+\s*[\w\-]*)\">\s*([\w\s\W]+?)<\/code>\s*<\/pre>/gm,
                replace: function(d, language_name, code_content){
                    code_content = code_content.replace(/</g, "&lt;");
                    code_content = code_content.replace(/>/g, "&gt;");

                    var $section = $('<section class="code-snippet__fix code-snippet__js"></section>');
                    var $ul = $('<ul class="code-snippet__line-index code-snippet__js"></ul>');

                    var lang_re = /(\w+) language-\1/g;
                    var match = lang_re.exec(language_name);
                    var language_str = "";
                    if(match) {
                        language_str = match[1];
                    }

                    const code_content_list = code_content.split("\n");


                    var $pre = $('<pre class="code-snippet__js" data-lang="' +language_str+'"></pre>');

                    for(let i=0; i < code_content_list.length; i++) {
                        if(!(i === code_content_list.length - 1 && code_content_list[i] === "")) {
                            const $li = $('<li></li>');
                            var str = "<br>";
                            if(code_content_list[i] !== ""){
                                str = code_content_list[i];

                            }
                            const $span = $('<code><span class="code-snippet_outer">'+ str +'</span></code>');

                            $ul.append($li);
                            $pre.append($span);

                        }

                    }

                    $section.append($ul);
                    $section.append($pre);
                    return $section[0].outerHTML;

                }

            };

            this.converter = new showdown.Converter({
                extensions: [link, ...bindings, codeblock],
                noHeaderId: true, // important to add this, else regex match doesn't work
                // simpleLineBreaks: true
                tables:true
            });



            let html = this.converter.makeHtml(this.md_editor.getValue());

            if (this.reference_index > 0) {
                // let reference = '## References';
                let reference = '';

                for(let i = 0; i < this.reference_list.length; i++) {
                    reference += ("\n" + this.reference_list[i] + "\n");
                }

                this.output = html + this.converter.makeHtml(reference);

            } else {
                this.output = html;
            }
            // var css_style = "<style>" + this.css_editor.getValue() + "</style>";
        },
        copy: function() {
            var clipboardDiv = document.getElementById('output');
            clipboardDiv.focus();
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            range.setStartBefore(clipboardDiv.firstChild);
            range.setEndAfter(clipboardDiv.lastChild);
            window.getSelection().addRange(range);

            try {
                if (document.execCommand('copy')) {
                    this.$message({
                        message: '已复制到剪贴板', type: 'success'
                    })
                } else {
                    this.$message({
                        message: '未能复制到剪贴板，请全选后右键复制', type: 'warning'
                    })
                }
            } catch (err) {
                this.$message({
                    message: '未能复制到剪贴板，请全选后右键复制', type: 'warning'
                })
            }
        },
        generate_style_map: function() {
            const css_raw_content = this.css_editor.getValue();
            const css_re = /\b\s*(\w+)\s*\{([\w\:\;\#\'\-\%\s]*)\}/g;
            match = css_re.exec(css_raw_content);
            var styleMap = {};
            while(match) {
                // console.log(match[0], match[1], match[2]);
                styleMap[match[1]] = match[2].trim();

                match = css_re.exec(css_raw_content);
            }
            return styleMap;
            // const match_result = css_raw_content.match(/\b\s*(\w+)\s*\{(.*)\}/g);
            // console.log(match_result);
        }
    }


});

$(document).ready(function(){


});
