<template>
    <div :class="$style.wrapper">
        <div :class="$style.title">
            {{title}}
        </div>
        <div :class="$style.tipsBox">
            <div>来源:</div>
            <div>{{source}}</div>
            <div>{{publishTime}}</div>
        </div>
        <article v-html="article" :class="$style.article"></article>
    </div>
</template>

<script>
    import  apiCall from 'util/xhr'
    import { MessageBox } from 'mint-ui';
    export default {
        data(){
            return {
                title: "",
                source:"",
                publishTime:"",
                article:""
            }
        },
        created() {

        },
        mounted(){
            let {infoId=0} = this.$route.query;
            apiCall.get(`/information/${infoId}/detail`).then(({title, source, publishTime, body})=>{
                this.title = title;
                this.source = source;
                this.publishTime = publishTime;
                this.article = body;
            },(status)=>{
                if(status === 404){
                    MessageBox("提示", "请确认网络是否正常")
                }else{
                    MessageBox("提示", status)
                }
            });
        }
    }
</script>

<style lang="less" module>
    .wrapper {
        padding: 76px 36px;
    }

    .title {
        font-size: 48px;
        color: #323744;
        text-align: justify;
    }
    .tipsBox{
        margin-top: 20px;
        font-size: 26px;
        >div{
            display: inline-block;
            vertical-align: middle;
            margin-right: 30px;
        }
    }
    .article{
        margin-top: 60px;
        >div{
            line-height: 1.5;
        }
        a{
            font-size: 28px;
        }
        img{
            max-width: 100%!important;
        }
    }
</style>
