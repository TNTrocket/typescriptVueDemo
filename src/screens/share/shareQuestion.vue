<template>
    <div :class="$style.warpper">
        <div :class="$style.typeName">{{typeName}}</div>
        <div v-if="type !== 'Comprehensive'">
            <div :class="$style.singleContent" v-html="content"></div>
            <ul :class="$style.choice">
                <li v-for="(item, index) in chooseOption">
                    <div :class="$style.icon">{{item.optionTitle}}</div>
                    <div v-html="item.content" :class="$style.optionTxt"></div>
                </li>
            </ul>
        </div>
        <div v-else :class="$style.comprehensiveBox">
            <div :class="$style.comprehensive" v-for="(item, index) in contentArray">
                <div :class="$style.questionNumber">{{index + 1}}/{{contentArray.length}}</div>
                <div :class="[$style.singleContent, $style.comprehensiveContent]" v-html="item.content"></div>
            </div>
        </div>
        <footerDownload></footerDownload>
    </div>
</template>

<script>
    import apiCall from 'util/xhr'
    import {MessageBox} from 'mint-ui';
    import footerDownload from 'components/footerDownload/index'

    export default {
        data() {
            return {
                type: '',
                contentArray: [],
                content: "",
                typeName: '',
                chooseOption: [],
                scrollHeight: ""
            }
        },
        created() {
            let {questionId = 0} = this.$route.query;
            apiCall.get(`/share/question/${questionId}`).then((data) => {
                this.type = data.type;
                this.content = data.content;
                this.chooseOption = data.options || [];
                this.contentArray = data.children || [];
            })
        },
        watch: {
            type: function (newType) {
                switch (newType) {
                    case "SingleChoice":
                        this.typeName = "单选题";
                        break;
                    case "Essay":
                        this.typeName = "文字题";
                        break;
                    case "JudgeEssay":
                        this.typeName = "论述题";
                        break;
                    default:
                        this.typeName = "综合题";
                }
            }
        },
        mounted() {

        },
        components: {
            footerDownload: footerDownload
        }
    }
</script>

<style lang="less" module>
    .singleContent {
        font-size: 32px;
        padding: 20px 30px 72px 30px;
    }

    .typeName {
        font-size: 30px;
        color: #0076FF;
        height: 90px;
        padding-left: 30px;
        line-height: 90px;
        background: #fff;
    }
    body{
        background: #EFEFF4;
    }
    .warpper {
        background: #EFEFF4;
        overflow-y: scroll;
        padding-bottom: 140px;
    }


    .choice {
        list-style: none;
        font-size: 32px;
        li {
            margin-bottom: 60px;
            padding: 0 30px;
            display: flex;
        }
    }

    .icon {
        flex: none;
        margin-right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        line-height: 60px;
        background: #B4BCC8;
    }

    .optionTxt {
        flex: 1;
        display: flex;
        align-items: center;
        word-break: break-all;
    }

    .comprehensive {
        font-size: 32px;
    }

    .comprehensiveContent {
        padding: 10px 30px 72px 30px;
    }

    .questionNumber {
        color: #0076FF;
        margin-left: 30px;
    }

    .comprehensiveBox {
        margin-top: 30px;
    }
</style>
