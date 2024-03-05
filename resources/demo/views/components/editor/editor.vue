<template>
    <el-tiptap :content="content" @onUpdate="onEditorUpdate" lang="zh" :extensions="extensions" :height="height"
               placeholder="请输入文章内容"></el-tiptap>
</template>

<script>
//此编辑器有个BUG，打包后会报Duplicate use of selection JSON ID cell at Selection.jsonID的错误
//原因：引入了不同版本的模块prosemirror-tables
//解决1：找到tiptap-extensions依赖，删除node-modules/prosemirror-tables目录
//解决2：找到tiptap-extensions依赖，修改node-modules/prosemirror-tables目录为node-modules-
import {
    ElementTiptap,
    Doc,
    Text,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Strike,
    Underline,
    Link,
    Image,
    Iframe,
    CodeBlock,
    Blockquote,
    ListItem,
    BulletList,
    OrderedList,
    TodoItem,
    TodoList,
    TextAlign,
    Indent,
    LineHeight,
    HorizontalRule,
    HardBreak,
    TrailingNode,
    History,
    Table,
    TableHeader,
    TableCell,
    TableRow,
    FormatClear,
    TextColor,
    TextHighlight,
    Preview,
    Print,
    Fullscreen,
    SelectAll,
    FontType,
    FontSize,
    CodeView,
} from 'element-tiptap';
import Cimage from "../../components/cimage/index";
import 'element-tiptap/lib/index.css';
import {UploadImage} from "../../../utils/request.js";

export default {
    name: "editor",
    components: {'el-tiptap': ElementTiptap},
    model: {
        prop: 'content',
        event: 'input',
    },
    props: {
        content: {
            type: String,
            default: ''
        },
        height: {
            type: String,
            default: '100%'
        }
    },
    data: function () {
        return {
            extensions: [
                new Doc(),

                new Text(),
                new Paragraph(),
                new Heading({level: 5}),
                new Bold({bubble: true}),
                new Italic(),
                new Strike(),
                new Underline(),
                new Link(),
                new Cimage(),
                // new Iframe(),
                new CodeBlock(),
                new Blockquote(),
                new ListItem(),
                new BulletList(),
                new OrderedList(),
                new TodoItem(),
                new TodoList(),
                new TextAlign(),
                new Indent(),
                new LineHeight(),
                new HorizontalRule(),
                new HardBreak(),
                new TrailingNode(),
                // new History(),
                new Table(),
                new TableHeader(),
                new TableCell(),
                new TableRow(),
                new FormatClear(),
                new TextColor(),
                new TextHighlight(),
                new Preview(),
                // new Print(),
                // new Fullscreen(),
                // new SelectAll(),
                new FontType(),
                new FontSize(),
                // new CodeView(),
            ],
        }
    },
    methods: {
        onEditorUpdate($event) {
            this.$emit('input', $event)
        }
    }
}
</script>

<style>
.el-tiptap-editor__content {
    min-height: 350px !important;
    padding: 30px 20px 0 !important;
}

.el-tiptap-editor .ProseMirror {
    min-height: 320px !important;
}

.el-tiptap-editor__content .image-view {
    margin: 0 !important;
    line-height: 0 !important;
    display: block !important;
}

.el-tiptap-editor__content .image-view__body {
    display: block !important;
}

</style>
