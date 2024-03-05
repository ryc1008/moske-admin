import CryptoJS from 'crypto-js';

const KEY = 'moske66889966988';//为了避免补位，直接用16位的秘钥
const IV  = 'moske88668899688';//16位初始向量

let crypto = {
    decrypt(data){
        let key = CryptoJS.enc.Latin1.parse(KEY);
        let iv = CryptoJS.enc.Latin1.parse(IV);
        let decrypted = CryptoJS.AES.decrypt(data, key, {
            iv: iv,
            mode:CryptoJS.mode.CBC,
            padding:CryptoJS.pad.Pkcs7
        });
        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    },
    encrypt(data){
        let key = CryptoJS.enc.Latin1.parse(KEY);
        let iv = CryptoJS.enc.Latin1.parse(IV);
        let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
            iv: iv,
            mode:CryptoJS.mode.CBC,
            padding:CryptoJS.pad.ZeroPadding
        });
        return encrypted.toString();
    }
};
export default crypto;
