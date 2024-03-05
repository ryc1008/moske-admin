import {Image as OriginalImage} from 'element-tiptap';
import CustomImage from './cimage.vue';

//解决了两个事情：1不能多图上传的问题 2默认设置宽度的问题
export default class Cimage extends OriginalImage {
    get schema() {
        return {
            inline: true, attrs: {
                src: {}, alt: {
                    default: null,
                }, title: {
                    default: null,
                },
            }, group: 'inline', draggable: true, parseDOM: [{
                tag: 'img[src]', getAttrs: dom => ({
                    src: dom.getAttribute('src'), title: dom.getAttribute('title'), alt: dom.getAttribute('alt'),
                }),
            },], toDOM: node => ['img', node.attrs],
        }
    }

    menuBtnView({isActive, commands, focus, editor}) {
        return {
            component: CustomImage, componentProps: {width: ''}, componentEvents: {
                insert: (text = '') => {
                    commands.image({src: text});
                },
            },
        };
    }
}
