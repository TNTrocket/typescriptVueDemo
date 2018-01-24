<template>
    <div :class="$style.wrapper">
        <div :class="$style.headerBox" v-touch:swipe="handle">
            <div  :class="$style.headerBox">
                <div :class="$style.header">
                    <div :class="$style.box">
                        <div :class="$style.title">
                            {{title}}&nbsp;{{currentAnswer + 1}}/{{answerList.length}}
                        </div>
                        <div :class="$style.module">
                            {{currentList.module}}
                        </div>
                    </div>
                    <div :class="$style.name">
                        {{currentList.word}}&nbsp;{{currentList.phonogram}}
                    </div>
                </div>
                <div :class="$style.optionBox">
                    <div v-for="(item, index) in currentList.options"
                         :class="{ [$style.options]: true,
                  [$style.right]: respondenceList[currentAnswer].isAnswer && currentList.currectOption === item.option,
                  [$style.wrong]: respondenceList[currentAnswer].index === index}"
                         @click="respondence(item,index)"
                    >
                        <div :class="$style.answer">
                            {{item.option}}
                        </div>
                        <div :class="$style.txt">
                            {{item.meaning}}
                        </div>
                    </div>
                </div>
                <div :class="$style.rightAnswer" v-if="respondenceList[currentAnswer]">
                    <div v-if="respondenceList[currentAnswer].isAnswer">
                        <div :class="$style.answerTitle">
                            正确答案
                        </div>
                        <div :class="$style.meaning">
                            {{Pos}}&nbsp;&nbsp;{{currentMeaning}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div :class="$style.footer">
            <div :class="$style.prev" v-if="currentAnswer!==0" @click="goPrev">
                <div><span :class="$style.prevArrow"></span>上一个</div>
            </div>
            <div :class="$style.btn" @click="respondence"
                 v-if="!noKnowBtn && !isNeedDelete && respondenceList[currentAnswer].isCurrent !==false">
                不认识
            </div>
            <div :class="$style.btn"
                 v-else-if="!noKnowBtn && !isNeedDelete && !respondenceList[currentAnswer].isCurrent">
                已加入错词本
            </div>
            <div :class="$style.btn" @click="deleteWrong" v-else-if="isNeedDelete">
                删除
            </div>
            <div v-else-if="currentAnswer>0" :class="$style.broder"></div>
            <div :class="$style.next" @click="goNext" v-if="currentAnswer+1!==respondenceList.length">
                <div>下一个<span :class="$style.nextArrow"></span></div>
            </div>
            <div v-else @click="finish">
                <div>完成<span :class="$style.nextArrow"></span></div>
            </div>
        </div>
    </div>
</template>

<script>
    import apiCall from 'util/xhr'
    import {cache} from 'util/global'
    import {Indicator,MessageBox} from 'mint-ui';

    export default {
        props: {
            word: {
                type: Array,
                default: true
            },
            title: String,
            isFinish: {
                type: Function,
                default: () => {
                }
            },
            noKnowBtn:{
                type: Boolean,
                default: false
            },
            isNeedDelete:{
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                answerList: [],
                currentAnswer: 0,
                respondenceList: [],
                currentMeaning: '',
                wrongWordsList:[],
                respondenceListLength:0
            }
        },
        created() {
            this.answerList = this.word;
            for (let item of this.answerList) {
                let temp = {};
                this.respondenceList.push(temp)
            }
            this.respondenceListLength = this.respondenceList.length
        },
        mounted() {
            this.keepStatus();
        },
        computed: {
            currentList: function () {
                return this.answerList[this.currentAnswer] || {}
            },
            questionId: function () {
                return this.answerList[this.currentAnswer].questionId || ""
            },
            Pos: function () {
                return this.answerList[this.currentAnswer].pos || ""
            },
            currectOptionId:function () {
                return this.answerList[this.currentAnswer].currectOptionId || ""
            }
        },
        watch:{
            currentAnswer:function () {
                this.keepStatus();
            }
        },
        methods: {
            respondence: function (data, index) {
                let finalOption = this.currentList.finalOption;
                let isAnswer = finalOption ? finalOption : this.respondenceList[this.currentAnswer].isAnswer
                console.log(isAnswer)
                if (!isAnswer) {
                    let tempObj = {
                        isAnswer: true,
                        questionId: this.questionId,
                    };
                    if (data.option === this.currentList.currectOption) {
                        tempObj.isCurrent = true;
                    } else {
                        tempObj.isCurrent = false;
                        tempObj.index = index;
                        this.wrongWordsList.push(this.currentList)
                    }
                    Indicator.open();
                    apiCall.post("/TKT/feedbackList", {
                        feedbackList: [{
                            isCurrent: tempObj.isCurrent ? 1 : 0,
                            questionId: this.questionId,
                            finalChoice: data.option
                        }]
                    }).then(() => {
                        Indicator.close();
                        this.$set(this.respondenceList, this.currentAnswer, tempObj)
                    });
                }
            },
            goNext: function () {
                this.currentAnswer = this.currentAnswer + 1;
            },
            goPrev: function () {
                this.currentAnswer = this.currentAnswer - 1;
            },
            handle: function (type) {
               switch (type){
                   case "swipeleft":
                       if (this.currentAnswer + 1 !== this.respondenceList.length) {
                           this.currentAnswer = this.currentAnswer + 1;
                       }
                       break;
                   case "swiperight":
                       if (this.currentAnswer !== 0) {
                           this.currentAnswer = this.currentAnswer - 1;
                       }
               }

            },
            finish: function () {
                this.isFinish(this.respondenceList,this.wrongWordsList);
            },
            deleteWrong () {
                Indicator.open();
                apiCall.post("/TKT/deleteWrongWordList",{
                    feedbackList:[{
                        batchId: cache.get("batchId"),
                        wordId: this.currectOptionId,
                        delete:1
                    }]
                }).then(()=>{
                    Indicator.close();
//                    this.answerList.splice(this.currentAnswer,1);
                    this.$delete(this.respondenceList, this.currentAnswer);
                    this.$delete(this.answerList, this.currentAnswer);
                    if(this.currentAnswer+1 === this.respondenceListLength){
                        this.finish();
                    }else{
                        this.respondenceListLength = this.respondenceListLength-1;
                    }
//                    delete this.answerList[this.currentAnswer]
                })
            },
            keepStatus(){
                let target = this.currentList.options || [];
                let wrongChoice = "";
                let wrongIndex = 0;
                target.forEach((item,index)=>{
                    if (item.option === this.currentList.currectOption) {
                        this.currentMeaning = item.meaning;
                    }
                    else if(this.currentList.finalOption && this.currentList.finalOption === item.option ){
                        wrongChoice = item.option;
                        wrongIndex = index;
                    }
                });
                if (this.currentList.finalOption === this.currentList.currectOption) {
                    this.$set(this.respondenceList[this.currentAnswer],"isAnswer",true)
                }else if(this.currentList.finalOption && this.currentList.finalOption!== this.currentList.currectOption){
                    this.$set(this.respondenceList[this.currentAnswer],"isAnswer",true);
                    this.$set(this.respondenceList[this.currentAnswer],"index",wrongIndex)
                }
            }
        },


    }

</script>

<style lang="less" module>
    .wrapper {
        height: 100%;
        background: #EFEFF4;
    }

    .headerBox {
        height: 100%;
    }

    .header {
        background: #fff;
        padding: 0 30px;
    }

    .box {
        display: flex;
        justify-content: space-between;
        padding: 40px 0;
        .title, .module {
            font-size: 28px;
            color: #8E8E93;
        }
    }
    .broder{
        width: 2px;
        height: 100%;
        flex: none!important;
        background: #D1D1D6;
    }

    .name {
        font-size: 52px;
        padding-bottom: 52px;
    }

    .optionBox {
        padding: 0 30px;
        font-size: 32px;
        .options {
            margin-top: 60px;
            display: flex;
            padding: 10px 0;
            > div {
                margin-right: 40px;
            }
        }
    }

    .right {
        color: #0FAA69;
    }

    .wrong {
        color: red;
    }

    .rightAnswer {
        padding: 60px 30px 0 30px;
        .answerTitle {
            font-size: 40px;
            color: #0FAA69;
        }
        .meaning {
            font-size: 32px;
            margin-top: 20px;
        }
    }

    .footer {
        position: absolute;
        bottom: 0;
        width: 750px;
        height: 112px;
        background: #fff;
        display: flex;
        font-size: 36px;
        z-index: 999;
        > div {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .btn {
            background: #D1D1D6;
            color: #fff;
        }
    }

    .nextArrow, .prevArrow {
        background-image: url("../../img/blackArrow.png");
        width: 16px;
        height: 28px;
        display: inline-block;
        background-size: 100%, 100%;
        background-repeat: no-repeat;
    }

    .nextArrow {
        margin-left: 20px;
    }

    .prevArrow {
        transform: rotate(180deg);
        margin-right: 20px;
    }


</style>
