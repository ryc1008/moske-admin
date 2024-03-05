import {Notification} from 'element-ui';
import Moment from 'moment';
import adminStore from '@/store/system.js';

const Func = {
    error(msg) {
        Notification.error({
            title: '错误',
            duration: '1500',
            message: msg
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

    verify(code) {
        return new Promise((resolve) => {
            if(adminStore.state.user.role_id == 1 || adminStore.state.rules.includes(code.toString())){
                resolve();
            }else{
                this.error('抱歉，您的权限不足');
            }
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

    randNumber(min, max) {
        min = min ? min : 500;
        max = max ? max : 9999;
        return Math.floor(Math.random() * (max - min) + min);
    },

    isImage(link){
        let reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
        if(!reg.test(link)){
            return false;
        }
        return true
    },

    getVideoTime(time){
        const dateObj = new Date(time * 1000);
        // 提取小时、分钟和秒数
        const hours = dateObj.getUTCHours();
        const minutes = dateObj.getUTCMinutes();
        const seconds = dateObj.getSeconds();
        // 构建时间格式字符串
        let timeString = '';
        if (hours > 0) {
            timeString += `0${hours}:`;
        }
        if (minutes > 0) {
            timeString += minutes < 10 ? `0${minutes}:` : `${minutes}:`;
        }
        timeString += seconds < 9 ? `0${seconds + 1}` : `${seconds + 1}`;
        return timeString;
    }
};
export default Func;
