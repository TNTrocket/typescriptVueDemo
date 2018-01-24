<template>
    <div :class="$style.wrapper">
        <div :class="$style.loginForm">
            <div :class="$style.title">
                请使用尚德机构APP的手机号登录
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
                温馨提示：注册新账号可以下载“尚德机构”APP
            </div>
        </div>
    </div>
</template>

<script>
    import apiCall from 'util/xhr'
    import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'


    export default {
//        data() {
//            return {
//                targetUrl: ""
//            }
//        },
        created() {

        },
        mounted() {

        },
        methods: {
            login: function () {
                this.validateForm();
            },
            validateForm() {
                this.$validator.validateAll({
                    phone: this.$refs.phone.value,
                    password: this.$refs.password.value
                }).then((result) => {
                    if (result) {
                        this.dispatchLogin({
                            mobile: this.$refs.phone.value,
                            password: this.$refs.password.value,
                        }).then(()=>{
                            this.$router.push({path: 'index'})
                        },()=>{
                            console.log("fff");
                        });
                        return;
                    }
                });
            },
            ...mapActions({
                    dispatchLogin: "login"
                }
            ),
            clearErrors() {
                this.errors.clear();
            }

        },
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
