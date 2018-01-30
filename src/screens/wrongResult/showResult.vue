<template>
    <div :class="$style.resultWrapper">
        <answer :word="this.newWord" v-if="this.newWord.length!==0 && !iscomplete"
                :title="resultTitle" :isFinish="isFinish" :noKnowBtn="noKnowBtn"
                :isPropsNeedDelete="isPropsNeedDelete" :wordType="0"
        ></answer>
        <div v-else-if="iscomplete">
            <div :class="$style.resultBox">
                <div :class="$style.header">
                    <div :class="$style.title">
                        本次正确率 <span :class="$style.percent">
                        {{Math.floor(rightNumber / answerNumber * 100)}}%</span>
                    </div>
                    <div :class="$style.process">
                        <div>
                            完成：{{rightNumber + wrongNumber}}/{{answerNumber}}
                        </div>
                        <div>
                            正确：{{rightNumber}}
                        </div>
                        <div>
                            错误：{{wrongNumber}}
                        </div>
                        <div>
                            错题：{{wrongWordNo}}
                        </div>
                    </div>
                </div>
            </div>
            <div :class="$style.delete" v-show="rightNumber && isNeedDelete">
                <span @click="deleteWrongWordList">删除本次答对的单词</span>
                <span :class="$style.deleteArrow"></span>
            </div>
            <div :class="$style.wrongWordsList">
                <div :class="$style.title" v-show="wrongNumber!==0">
                    以下单词需要再加强记忆
                </div>
                <div :class="$style.wordsBox" v-for="item in wrongWordsList">
                    <div :class="$style.word">
                        <div :class="$style.name">
                            {{item.word}}
                        </div>
                        <div :class="$style.prom">
                            {{item.phonogram}}
                        </div>
                    </div>
                    <div :class="$style.tips">
                        <div>{{item.pos}}&nbsp;{{item.meaning}}</div>
                    </div>
                </div>
            </div>
            <div :class="$style.btn" @click="goHomePage">回到首页</div>
        </div>
        <div v-else-if="!iscomplete ">
            <toast></toast>
        </div>
    </div>
</template>

<script>
    import apiCall from 'util/xhr'
    import answer from 'components/answer/index'
    import toast from 'components/toast/Toast'
    import {cache} from 'util/global'
    import {Indicator, MessageBox} from 'mint-ui';

    export default {
        props: {
            resultTitle: {
                type: String,
                default: "新单词"
            },
            noKnowBtn: {
                type: Boolean,
                default: false
            },
            isPropsNeedDelete: {
                type: Boolean,
                default: false
            },
            resultMode: String
        },
        data() {
            return {
                newWord: [],
                module: [],
                iscomplete: false,
                answerNumber: 1,
                rightNumber: 0,
                wrongNumber: 0,
                wrongWordsList: [],
                totalNo: 0,
                practicedNo: 0,
                wrongWordNo: 0,
                originAnswerNumber: 0,
                deleteWordList: [],
                isNeedDelete:false
            }
        },
        created() {
            let batchId = cache.get("batchId") || "";
            this.totalNo = cache.get("totalNo") || 0;
            this.practicedNo = cache.get("practicedNo") || 0;
            this.wrongWordNo = cache.get("wrongWordNo") || 0;
            this.iscomplete = cache.get("iscomplete") || "";
            let {praticType = "", module = ""} = this.$route.query;
            if (this.iscomplete) {
                this.isFinish();
            } else {
                apiCall.post("/tkt/answerList", {
                    praticType: praticType,
                    batchId: batchId,
                    module: module
                }).then((data) => {
                    cache.set("batchId", data.batchId);
                    for (let item of data.answerlist) {
                        if (item.type == 1) {
                            let temp = {};
                            item.answers.forEach((res, index) => {
                                if (temp[res.module]) {
                                    temp[res.module] += temp[res.module]
                                } else {
                                    temp[res.module] = 1;
                                }
                                for (let options of res.options) {
                                    if (res.currectOption === options.option) {
                                        item.answers[index].meaning = options.meaning
                                    }
                                }
                            });
                            this.newWord = item.answers;
                            this.module = temp;
                            this.originAnswerNumber = item.answers.length;
                        }
                    }
                })
            }

        },
        mounted() {

        },
        beforeUpdate(){

        },
        updated(){

        },
        methods: {
            isFinish: function () {
                let iscomplete = cache.get("iscomplete") || true;
                if (!cache.get("iscomplete")) {
                    cache.set("iscomplete", true);
                }
                this.iscomplete = iscomplete;
                let batchId = cache.get("batchId") || "";
                let {praticType = "", module = ""} = this.$route.query;
                Indicator.open();
                apiCall.post("/tkt/answerList", {
                    praticType: praticType,
                    batchId: batchId,
                    module: module
                }).then((data) => {
                    Indicator.close();
                    for (let item of data.answerlist) {
                        if (item.type == 1) {
                            let tempArray = [];
                            let rightNumber = 0;
                            let wrongNumber = 0;
                            let deleteList = [];
                            let deleteObj = {};
                            item.answers.forEach((res, index) => {
                                if (res.currectOption === res.finalOption) {
                                    rightNumber++;
                                    deleteObj.wordId = res.questionId;
                                    deleteObj.delete = "1";
                                } else if (res.finalOption) {
                                    wrongNumber++;
                                    for (let options of res.options) {
                                        if (res.currectOption === options.option) {
                                            res.meaning = options.meaning
                                        }
                                    }
                                    tempArray.push(res);
                                }
                            });
                            deleteList.push(deleteObj);
                            this.deleteWordList = deleteList;
                            this.rightNumber = rightNumber;
                            if(this.rightNumber>0){
                                this.isNeedDelete = true;
                            }
                            this.wrongNumber = wrongNumber;
                            this.answerNumber = item.answers.length;
                            this.wrongWordsList = tempArray;
                            if (this.originAnswerNumber > this.answerNumber) {
                                this.wrongWordNo = this.wrongWordNo - (this.originAnswerNumber - this.answerNumber)
                            }
                        }
                    }
                })
            },
            goHomePage() {
                this.$router.push({path: "index"})
            },
            deleteWrongWordList() {

                MessageBox({
                    message: `确定要从错词本删除这${this.deleteWordList.length || 0}个单词吗？`,
                    showConfirmButton: true,
                    showCancelButton: true,
                    title: "",
                    cancelButtonText: "取消",
                    confirmButtonText: "删除",
                    closeOnClickModal: false
                }).then(action => {
                    if (action === "cancel") {

                    } else {
                        Indicator.open();
                        apiCall.post("/tkt/deleteWrongWordList", {
                            batchId: cache.get("batchId") || "",
                            feedbackList: JSON.stringify(
                                {
                                    feedbackList: this.deleteWordList
                                }
                            )
                        }).then(() => {
                            this.isNeedDelete =false;
                            Indicator.close();
                        })

                    }

                });
            }

        },
        components: {
            answer,
            toast
        },
    }
</script>

<style lang="less" module>
    .resultWrapper {
        height: 100%;
        background: #EFEFF4;
        overflow-y: scroll;
        padding-bottom: 200px;
    }

    .delete {
        font-size: 32px;
        color: #5E3F8B;
        margin-top: 44px;
        text-align: center;
        > span {
            display: inline-block;
            vertical-align: middle;
        }
        .deleteArrow {
            background: url("../../img/indexDoneArrow.png");
            width: 16px;
            height: 28px;
            margin-left: 10px;
            background-size: 100% 100%;

        }
    }

    .btn {
        background: #FFE034;
        box-shadow: 0 8px 20px 0 rgba(255, 224, 52, 0.65);
        border-radius: 80px;
        width: 560px;
        height: 140px;
        font-size: 40px;
        color: #5E3F8B;
        text-align: center;
        line-height: 140px;
        position: fixed;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
    }

    .resultBox {
        text-align: center;
        font-size: 28px;
        background: #fff;
        padding: 0 30px;
        width: 750px;
        height: 240px;
        box-shadow: 0 12px 12px 0 rgba(166, 166, 166, 0.12);
        .title {
            line-height: 1;
            padding-top: 60px;
            font-size: 40px;
            .percent {
                font-size: 52px;
                color: #5E3F8B;
            }

        }
        .process {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
        }
    }

    .wrongWordsList {
        padding: 44px 30px 0 30px;
        .title {
            font-size: 32px;
            padding-bottom: 44px;
        }
    }

    .wordsBox {
        font-size: 32px;
        color: #8E8E93;
        margin-bottom: 24px;
        .word {
            display: flex;
            align-items: center;
            > div {
                margin-right: 28px;
            }
            .name {
                color: #000;
            }
        }
        .tips {
            margin-top: 10px;
            display: flex;
            align-items: center;
            font-size: 28px;
        }
    }
</style>
