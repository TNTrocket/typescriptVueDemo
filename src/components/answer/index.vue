<template>
    <div :class="$style.wrapper">
        <div :class="$style.headerBox" v-touch:swipe="handle">
            <div :class="$style.headerBox">
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
            <div :class="$style.btn" @click="unKnow"
                 v-if="!noKnowBtn && !isPropsNeedDelete && respondenceList[currentAnswer].isCurrent !==false">
                不认识
            </div>
            <div :class="$style.btn"
                 v-else-if="!noKnowBtn && !isPropsNeedDelete && !respondenceList[currentAnswer].isCurrent">
                已加入错词本
            </div>
            <div :class="$style.btn" @click="deleteWrong" v-else-if="isPropsNeedDelete">
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

<script lang='ts'>
import apiCall from "util/xhr";
import { cache } from "util/global";
import { Indicator, MessageBox } from "mint-ui";
import {
  Component,
  Emit,
  Inject,
  Model,
  Prop,
  Provide,
  Vue,
  Watch
} from "vue-property-decorator";

interface answerObj {
    isAnswer?:boolean;
    questionId?:string | number;
    isCurrent?:boolean;
    index?:number | string;
}
@Component
export default class extends Vue {
  @Prop({ default: [] })
  word: Array<any>;
  @Prop() title: string;
  @Prop({ default: () => {} })
  isFinish: Function;
  @Prop({ default: false })
  noKnowBtn: boolean;
  @Prop({ default: false })
  isPropsNeedDelete: boolean;
  @Prop({ default: false })
  wordType: number;

  @Watch("currentAnswer")
  keepStatus() {
    let target = this.currentList.options || [];
    let wrongChoice = "";
    let wrongIndex = 0;
    target.forEach((item, index) => {
      if (item.option === this.currentList.currectOption) {
        this.currentMeaning = item.meaning;
      } else if (
        this.currentList.finalOption &&
        this.currentList.finalOption === item.option
      ) {
        wrongChoice = item.option;
        wrongIndex = index;
      }
    });
    if (
      this.currentList.finalOption === this.currentList.currectOption ||
      this.currentList.finalOption === "E"
    ) {
      this.$set(this.respondenceList[this.currentAnswer], "isAnswer", true);
    } else if (
      this.currentList.finalOption &&
      this.currentList.finalOption !== this.currentList.currectOption
    ) {
      this.$set(this.respondenceList[this.currentAnswer], "isAnswer", true);
      this.$set(this.respondenceList[this.currentAnswer], "index", wrongIndex);
    }
  }
  //  {
  //         word: Array<any>,
  //         title: String,
  //         isFinish: {
  //             type: Function,
  //             default: () => {
  //             }
  //         },
  //         noKnowBtn: {
  //             type: Boolean,
  //             default: false
  //         },
  //         isPropsNeedDelete: {
  //             type: Boolean,
  //             default: false
  //         },
  //         wordType: {
  //             type: Number,
  //             default: 1
  //         }
  //     }

  // data() {
  //     return {
  answerList: Array<any> = [];
  currentAnswer: number = 0;
  respondenceList: Array<any> = [];
  currentMeaning: string = "";
  wrongWordsList: Array<any> = [];
  respondenceListLength: number = 0;
  //     }
  // }

  created() {
    this.answerList = this.word;
    for (let item of this.answerList) {
      let temp = {};
      this.respondenceList.push(temp);
    }
    this.respondenceListLength = this.respondenceList.length;
  }

  mounted() {
    this.keepStatus();
  }

  //        computed: {
  get currentList() {
    return this.answerList[this.currentAnswer] || {};
  }

  get questionId() {
    return this.answerList[this.currentAnswer].questionId || "";
  }

  get Pos() {
    return this.answerList[this.currentAnswer].pos || "";
  }

  get currectOptionId() {
    return this.answerList[this.currentAnswer].currectOptionId || "";
  }
  //    },

  //        methods: {
  respondence(data, index:string|number) {
    let finalOption = this.currentList.finalOption;
    let isAnswer = finalOption
      ? finalOption
      : this.respondenceList[this.currentAnswer].isAnswer;
    if (!isAnswer) {
      let tempObj:answerObj = {
        isAnswer: true,
        questionId: this.questionId
      };
      if (data.option === this.currentList.currectOption) {
        tempObj.isCurrent = true;
      } else {
        tempObj.isCurrent = false;
        tempObj.index = index;
        this.wrongWordsList.push(this.currentList);
      }
      Indicator.open();
      apiCall
        .post("/tkt/feedbackList", {
          batchId: cache.get("batchId"),
          feedbackList: JSON.stringify({
            feedbackList: [
              {
                isCurrent: tempObj.isCurrent ? 1 : 0,
                questionId: this.questionId,
                finalChoice: data.option,
                type: this.wordType,
                currectOptionId: this.currectOptionId
              }
            ]
          })
        })
        .then(
          () => {
            Indicator.close();
            this.$set(this.respondenceList, this.currentAnswer, tempObj);
          },
          () => {
            Indicator.close();
            MessageBox({
              message: "答案提交失败，请检查网络后再试一次",
              showConfirmButton: true,
              title: "",
              confirmButtonText: "确认",
              closeOnClickModal: false
            });
          }
        );
    }
  }
  unKnow() {
    this.respondence({option:"E"},'')
  }
  goNext() {
    this.currentAnswer = this.currentAnswer + 1;
  }
  goPrev() {
    this.currentAnswer = this.currentAnswer - 1;
  }
  handle(type) {
    switch (type) {
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
  }
  finish() {
    this.isFinish(this.respondenceList, this.wrongWordsList);
  }
  deleteWrong() {
    MessageBox({
      message: "确定要从错词本删除它？",
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
        apiCall
          .post("/tkt/deleteWrongWordList", {
            batchId: cache.get("batchId"),
            feedbackList: JSON.stringify({
              feedbackList: [
                {
                  wordId: this.currectOptionId,
                  delete: 1
                }
              ]
            })
          })
          .then(
            () => {
              Indicator.close();

              this.$delete(this.respondenceList, this.currentAnswer);
              this.$delete(this.answerList, this.currentAnswer);
              if (this.currentAnswer + 1 === this.respondenceListLength) {
                this.finish();
              } else {
                this.respondenceListLength = this.respondenceListLength - 1;
              }
            },
            () => {
              Indicator.close();
              MessageBox({
                message: "答案提交失败，请检查网络后再试一次",
                showConfirmButton: true,
                title: "",
                confirmButtonText: "确认",
                closeOnClickModal: false
              });
            }
          );
      }
    });
  }
  //        },
}
</script>

<style lang="less" module>
.wrapper {
  height: 100%;
  background: #efeff4;
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
  .title,
  .module {
    font-size: 28px;
    color: #8e8e93;
  }
}

.broder {
  width: 2px;
  height: 100%;
  flex: none !important;
  background: #d1d1d6;
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
  color: #0faa69;
}

.wrong {
  color: red;
}

.rightAnswer {
  padding: 60px 30px 0 30px;
  .answerTitle {
    font-size: 40px;
    color: #0faa69;
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
    background: #d1d1d6;
    color: #fff;
  }
}

.nextArrow,
.prevArrow {
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
