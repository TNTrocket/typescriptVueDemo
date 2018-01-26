<template>
    <div :class="$style.resultWrapper">
        <answer :word="this.newWord" v-if="this.newWord.length!==0 && !iscomplete"
                :title="resultTitle" :isFinish="isFinish" :noKnowBtn="noKnowBtn"
                :isNeedDelete="isNeedDelete"
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
                        <div v-show="resultMode && resultMode=='practiced'">
                           总进度：{{parseInt(practicedNo) + rightNumber + wrongNumber}}/{{totalNo}}
                        </div>
                    </div>
                </div>
            </div>
            <div :class="$style.wrongWordsList">
                <div :class="$style.title" v-show="wrongWordsList.length!==0">
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

    export default {
        props: {
            resultTitle: {
                type: String,
                default: "新单词"
            },
            practicType: {
                type: Number,
                default: 0
            },
            noKnowBtn: {
                type: Boolean,
                default: false
            },
            isNeedDelete: {
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
                totalNo:0,
                practicedNo:0,
                wrongWordNo:0
            }
        },
        created() {
            let batchId = cache.get("batchId") || "";
            this.totalNo = cache.get("totalNo") || 0;
            this.practicedNo = cache.get("practicedNo") || 0;
            this.wrongWordNo = cache.get("wrongWordNo") || 0;
            this.iscomplete = cache.get("iscomplete") || "";
            if (this.iscomplete) {
                let rightNumber = 0;
                let wrongNumber = 0;
                let cacheData = cache.get("resultData") || null;
                let data = JSON.parse(cacheData) || [];
                this.answerNumber = data.length || 1;
                data.forEach((item) => {
                    if (item.isCurrent === true) {
                        rightNumber++;
                    } else if (item.isCurrent === false) {
                        wrongNumber++;
                    }
                });
                this.wrongWordsList = cache.get("wrongList") || [];
                this.wrongNumber = wrongNumber;
                this.rightNumber = rightNumber;

            } else {

                apiCall.post("/tkt/answerList", {
                    practicType: this.practicType,
                    batchId: batchId
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
                            this.module = temp
                        }
                    }
                })
            }
        },
        mounted() {

        },
        methods: {
            isFinish: function (data, wrongList) {
                let iscomplete = cache.get("iscomplete") || true;

                let cacheWrong = cache.get("wrongList") || [];
                this.wrongWordsList = wrongList || cacheWrong;

                let rightNumber = 0;
                let wrongNumber = 0;
                let cacheData = cache.get("resultData") || null;
                data = data || JSON.parse(cacheData) || [];
                if (!cacheData) {
                    cache.set("resultData", data);
                }
                if (cacheWrong.length === 0) {
                    cache.set("wrongList", wrongList);
                }
                if (!cache.get("iscomplete")) {
                    cache.set("iscomplete", true);
                }
                this.answerNumber = data.length || 1;
                data.forEach((item) => {
                    if (item.isCurrent === true) {
                        rightNumber++;
                    } else if (item.isCurrent === false) {
                        wrongNumber++;
                    }
                });
                this.wrongNumber = wrongNumber;
                this.rightNumber = rightNumber;
                this.iscomplete = iscomplete
            },
            goHomePage() {
                this.$router.push({path: "index"})
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
