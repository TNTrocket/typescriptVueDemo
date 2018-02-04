<template>
    <div :class="$style.wrapper">
        <div :class="$style.loginForm">
            <div :class="$style.title">
                登录
            </div>
            <div :class="$style.inputBox">
                <input name="phone" type="text" ref="phone" placeholder="请输入手机号码"
                       v-validate="'required|checkPhone'"
                />
                <span v-show="errors.has('phone')" :class="$style.error">{{ errors.first('phone') }}</span>
            </div>
            <div :class="$style.inputBox">
                <input name="password" type="password" ref="password" placeholder="请输入密码"
                       v-validate="'required|checkPassword'"
                />
                <span v-show="errors.has('password')" :class="$style.error">{{ errors.first('password') }}</span>
            </div>
            <div :class="$style.btn" @click="login">
                登录
            </div>
            <div :class="$style.tips">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import apiCall from 'util/xhr'
    import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
    import {Indicator, MessageBox} from 'mint-ui';
    import {cache} from 'util/global';
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import { Getter, Action } from 'vuex-class'

    @Component({})
    export default class Login extends Vue {
        @Action('login') dispatchLogin: Function;

        $refs: {
            phone: HTMLFormElement,
            password:HTMLFormElement
        };


        created() {
            cache.remove("token");
//            console.log(this.$style.btn);
        }
        mounted() {

        }

        login(){
            this.validateForm();
        }
        validateForm() {
            this.$validator.validateAll({
                phone: this.$refs.phone.value,
                password: this.$refs.password.value
            }).then((result) => {
                if (result) {
                    Indicator.open();
                    this.dispatchLogin({
                        mobile: this.$refs.phone.value,
                        password: this.$refs.password.value,
                    }).then(()=>{
                        Indicator.close();
                        this.$router.push({path: 'index'})
                    },()=>{
                        Indicator.close();
                        MessageBox({
                            message:"手机号或密码错误",
                            showConfirmButton: true,
                            title:"",
                            confirmButtonText:"确认",
                            closeOnClickModal:false
                        });
                    });
                    return;
                }
            });
        }
    }
</script>

<style lang="less" module>
    .error {
        font-size: 24px;
        color: red;
        position: absolute;
        bottom: -40px;
        white-space: nowrap;
    }

    　.wrapper {
        background-image: url("../../img/loginBg.png");
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        .loginForm {
            padding-top: 126px;
        }
        .title {
            text-align: center;
            margin-bottom: 106px;
            font-size: 36px;
            color: #FFFFFF;
            letter-spacing: -0.43px;
            font-weight: lighter;
        }
        .inputBox {
            width: 560px;
            height: 108px;
            margin: 0 auto 60px auto;
            background: #fff;
            border-radius: 16px;
            display: flex;
            align-items: center;
            padding-left: 28px;
            position: relative;
            input {
                font-size: 32px;
                border: 0;
                outline: none;
                width: 100%;
            }
        }
        .btn {
            width: 560px;
            height: 84px;
            line-height: 84px;
            margin: 76px auto 30px auto;
            text-align: center;
            background: #FFE034;
            border-radius: 118px;
            font-size: 40px;
            color: #5E3F8B;
        }
        .tips {
            font-size: 24px;
            color: #EFEFF4;
            text-align: center;
            letter-spacing: -0.29px;
        }
    }
</style>
