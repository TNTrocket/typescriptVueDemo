<template>
    <div :class="$style.wrapper">
        <div :class="$style.practiced" v-if="practicedNumber!==0">
            <div :class="{
           [$style.header]:true,
           [$style.whiteBg]:!barFixed,
           [$style.fixed]:!barFixed
            }" v-if="practicedList.length!==0">
                Module{{moduleName}}&nbsp;已练习&nbsp;({{practicedNumber}}/{{practicedNumber + unpracticedNumber}})
            </div>
            <div :class="$style.wordsBox" v-for="item in practicedList">
                <div :class="$style.word">
                    <div :class="$style.name">
                        {{item.word}}
                    </div>
                    <div :class="$style.prom">
                        {{item.phonogram}}
                    </div>
                </div>
                <div :class="$style.tips">
                    <div>{{item.partOfSpeech}}&nbsp;{{item.meaning}}</div>
                </div>
            </div>
        </div>
        <div :class="$style.unPracticed">
            <div :class="{
            [$style.header]:true,
           [$style.whiteBg]:barFixed,
           [$style.fixed]:barFixed
            }" v-if="unpracticedList.length!==0">
                Module{{moduleName}}&nbsp;未练习&nbsp;({{unpracticedNumber}}/{{practicedNumber + unpracticedNumber}})
            </div>
            <div :class="$style.wordsBox" v-for="item in unpracticedList">
                <div :class="$style.word">
                    <div :class="$style.name">
                        {{item.word}}
                    </div>
                    <div :class="$style.prom">
                        {{item.phonogram}}
                    </div>
                </div>
                <div :class="$style.tips">
                    <div>{{item.partOfSpeech}}&nbsp;{{item.meaning}}</div>
                </div>
            </div>
        </div>
        <div :class="$style.btn" @click="modeAgain" v-if="unpracticedNumber === 0">
            {{againTxt}}
        </div>
        <div :class="$style.btn" @click="goResult" v-else>
            {{btnTxt}}
        </div>
    </div>
</template>

<script lang="ts">
import apiCall from "util/xhr";
import { cache } from "util/global";
import { Indicator, MessageBox } from "mint-ui";
import Vue from "vue";
import Component from "vue-class-component";
import { Getter, Action } from "vuex-class";

@Component
export default class extends Vue {
  moduleName: string = "";

  practicedList: Array<any> = [];

  unpracticedList: Array<any> = [];

  barFixed: boolean = false;

  practicedNumber: number = 0;

  unpracticedNumber: number = 0;

  btnTxt: string = "开始练习";

  againTxt: string = "";

  $style: {
    unPracticed: string;
    wrapper: string;
  };

  created() {
    this.init();
  }

  mounted() {}

  init() {
    Indicator.open();
    let { type = "", module = "" } = this.$route.query;
    apiCall
      .post("/tkt/moduleOrWrongWordOverview", {
        type,
        module
      })
      .then(data => {
        this.practicedList = data.wordList.practiced || [];
        this.unpracticedList = data.wordList.unpracticed || [];
        this.practicedNumber = this.practicedList.length || 0;
        this.unpracticedNumber = this.unpracticedList.length || 0;
        if (this.practicedNumber === 0) {
          this.btnTxt = "开始练习";
        } else if (this.unpracticedNumber !== 0 && this.practicedNumber !== 0) {
          this.btnTxt = "继续练习";
        }
        if (this.practicedNumber === 0) {
          this.barFixed = true;
        }
        this.againTxt = "重练一次";
        this.$nextTick(() => {
          if (this.practicedNumber !== 0) {
            let clientHeight = document.documentElement.clientHeight;
            let wrapperScrollHeight = document.querySelector(
              `.${this.$style.wrapper}`
            ).scrollHeight;
            if (wrapperScrollHeight > clientHeight) {
              let offsetDOm = <HTMLElement>document.querySelector(
                `.${this.$style.unPracticed}`
              );
              let offsetTop = offsetDOm.offsetTop;
              let scrollPX =
                offsetTop - clientHeight / 2 > 0
                  ? offsetTop - clientHeight / 2
                  : 0;
              document.querySelector(
                `.${this.$style.wrapper}`
              ).scrollTop = scrollPX;
            }
          }
          let wrapper = <HTMLElement>document.querySelector(
            `.${this.$style.wrapper}`
          );
          wrapper.onscroll = () => {
            let position = wrapper;
            if (this.practicedNumber !== 0) {
              let offsetDOm = <HTMLElement>document.querySelector(
                `.${this.$style.unPracticed}`
              );
              let offsetTop = offsetDOm.offsetTop;
              if (position.scrollTop >= offsetTop) {
                this.barFixed = true;
              } else {
                this.barFixed = false;
              }
            }
          };
        });
        Indicator.close();
      });
    this.moduleName = module;
  }

  goResult() {
    cache.remove("batchId");
    cache.remove("iscomplete");
    cache.remove("resultData");
    cache.remove("wrongList");
    let { module = "" } = this.$route.query;
    this.$router.push({
      path: "practicedResult",
      query: {
        module: module
      }
    });
  }

  modeAgain() {
    MessageBox({
      message: "已练习将会清空，错词本会保留。确定要重头再来吗？",
      showConfirmButton: true,
      showCancelButton: true,
      title: "",
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      closeOnClickModal: false
    }).then(action => {
      if (action === "cancel") {
      } else {
        Indicator.open();
        let { module = "" } = this.$route.query;
        apiCall
          .post("/tkt/replay", {
            module: module
          })
          .then(() => {
            this.init();
            Indicator.close();
          });
      }
    });
  }
}
</script>

<style lang="less" module>
.wrapper {
  height: 100%;
  background: #efeff4;
  overflow-y: scroll;
  padding-top: 122px;
  padding-bottom: 200px;
}

.fixed {
  position: fixed;
  top: 0;
}

.btn {
  background: #ffe034;
  box-shadow: 0 8px 20px 0 rgba(255, 224, 52, 0.65);
  border-radius: 80px;
  width: 560px;
  height: 140px;
  font-size: 40px;
  color: #5e3f8b;
  text-align: center;
  line-height: 140px;
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
}

.whiteBg {
  background: #fff !important;
  box-shadow: 0 12px 12px 0 rgba(166, 166, 166, 0.12);
}

　.practiced {
  .header {
    text-align: center;
    font-size: 32px;
    width: 750px;
    height: 112px;
    color: #5e3f8b;
    line-height: 112px;
    margin-bottom: 44px;
  }
}

.unPracticed {
  .header {
    text-align: center;
    font-size: 32px;
    width: 750px;
    height: 112px;
    color: #5e3f8b;
    line-height: 112px;
    margin-bottom: 44px;
  }
}

.wordsBox {
  font-size: 32px;
  color: #8e8e93;
  margin-bottom: 24px;
  padding: 0 30px;
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
