import {Notification} from 'element-ui';
import Moment from 'moment';

const Func = {
    error(msg) {
        return new Promise(resolve => {
            Notification.error({
                title: '错误',
                duration: '1500',
                message: msg,
                onClose: () => {
                    resolve();
                }
            });
        });
    },

    success(msg) {
        return new Promise(resolve => {
            Notification({
                title: '成功',
                message: msg,
                type: 'success',
                duration: '1500',
                onClose: () => {
                    resolve();
                }
            });
        });
    },

    formatTag(status){
        let type = '';
        switch (status){
            case 1:
                type = 'primary';
                break;
            case 2:
                type = 'danger';
                break;
            case 3:
                type = 'success';
                break;
            case 4:
                type = 'warning';
                break;
            default:
                type = 'info';
                break;
        }
        return type;
    },

    formatNumber(number) {
        let result = 0
        if (number >= 10000) {
            result = (number / 10000) + '万'
        } else {
            result = number
        }
        return result
    },

    formatDateTime(time, format){
        format = format ? format : 'YYYY-MM-DD HH:mm:ss';
        return Moment(time).format(format);
    },

    assetsFile(name){
        return new URL(`../static/img/${name}`, import.meta.url).href;
    },

    strToBlank(str){
        //把&nbsp;转成空格实体
        let data = encodeURI(str);
        data = data.replace(/&nbsp;/g,'%20');
        return decodeURI(data);
    },

};
export default Func;
