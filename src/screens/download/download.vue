<template>
    <div :class="$style.wrapper">
        <a  :href="targetUrl" :class="$style.button">
            立即下载
        </a>
    </div>
</template>

<script>
    import apiCall from 'util/xhr'
    import platform from 'platform'

    export default {
        data() {
            return {
                targetUrl:""
            }
        },
        created() {
        },
        mounted() {
            if(this.isWechat()){
                this.targetUrl = "https://cn.vuejs.org/";
            }else{
                this.platformType = platform.os.family;
                switch (this.platformType){
                    case "iOS":
                        this.targetUrl = "http://baidu.com";
                        break;
                    case "Android":
                        this.targetUrl = "https://segmentfault.com";
                        break;
                }
            }
        },
        methods: {
            isWechat: function () {
                let ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    return true;
                } else {
                    return false;
                }
            }

        }
    }
</script>

<style lang="less" module>
    　.wrapper {
        background-image: url("../../img/download.jpg");
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        .button {
            width: 560px;
            height: 140px;
            background: #0076FF;
            position: absolute;
            bottom: 90px;
            left: 50%;
            transform: translateX(-50%);
            border-radius: 100px;
            font-size: 40px;
            color: #FFFFFF;
            text-align: center;
            line-height: 140px;
            font-weight: lighter;
            display: block;
            text-decoration: none;

        }
    }
</style>
