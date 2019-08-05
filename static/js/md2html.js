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
        converter:new showdown.Converter()

    },
    mounted: function () {
        let max_height = $(".main-section .el-col").height();
        $("#output").attr("style","height:" + (max_height-30-10-30) + "px;");

        var self = this;
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
            url: 'https://raw.githubusercontent.com/oliwang/md2html/master/static/default-md.md?token=ABIJUOZKRLNX5RZLQSYQH7K5KFP72'
        }).then(function (resp) {
            self.md_editor.setValue(resp.data)
        });
        axios({
            method: 'get',
            url: 'https://raw.githubusercontent.com/oliwang/md2html/master/static/default-css.css?token=ABIJUO6IJ3X4Q6ZFFU4TALS5KFP6G'
        }).then(function (resp) {
            self.css_editor.setValue(resp.data)
        });


    },
    methods: {
        exportMarkdown: function(){
            this.exportFile("md");

        },
        exportCss: function(){
            this.exportFile("css");
        },
        exportFile:function(file_type){
            var editor_content = null;
            var filename = null;
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
            const bindings = Object.keys(styleMap)
                .map(key => ({
                    type: 'output',
                    regex: new RegExp(`<${key}>`, 'g'),
                    replace: `<${key} style="${styleMap[key]}">`
                }));


            const codeblock = {
                type: 'output',
                regex: /<pre>\s*<code class=\"([\w\-]+\s*[\w\-]*)\">\s*([\w\s\W]+)<\/code>\s*<\/pre>/g,
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
                        const $li = $('<li></li>');
                        var str = "<br>";
                        if(code_content_list[i] !== ""){
                            str = code_content_list[i];

                        }
                        const $span = $('<code><span class="code-snippet_outer">'+ str +'</span></code>');

                        $ul.append($li);
                        $pre.append($span);
                    }

                    $section.append($ul);
                    $section.append($pre);
                    return $section[0].outerHTML;

                }

            };

            this.converter = new showdown.Converter({
                extensions: [...bindings, codeblock],
                noHeaderId: true, // important to add this, else regex match doesn't work
                // simpleLineBreaks: true
                tables:true
            });

            var html = this.converter.makeHtml(this.md_editor.getValue());
            // var css_style = "<style>" + this.css_editor.getValue() + "</style>";
            this.output = html;
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
