import Vue from 'vue'
import VeeValidate, {Validator} from 'vee-validate';
import zh from 'vee-validate/dist/locale/zh_CN';

const dictionary = {
    zh: {
        messages: {
            required: (field) => {
               switch (field){
                   case "phone":
                       return '请输入手机号';
                       break;
                   case "password":
                       return  '请输入密码';
               }

            }
        }
    },

}


Validator.localize('zh', zh);
Validator.localize(dictionary);
Validator.extend('checkPhone', {
    getMessage: field => '请输入正确的手机号',
    validate: value => /^1[0-9]{10}$/.test(value)
})
Validator.extend('checkPassword', {
    getMessage: field => '请输入您登录尚德机构APP的密码，6-20位',
    validate: value => /^.{6,20}$/.test(value)
})


Vue.use(VeeValidate);