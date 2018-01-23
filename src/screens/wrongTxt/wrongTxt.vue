<template>
    <div :class="$style.wrapper" v-scroll="onScroll">
       <div :class="$style.wrongWordList" v-for="res in wrongWordList">
           <div :class="{
           [$style.header]:true,
           [res.module]:true,
           [$style.whiteBg]: res.module === moduleName
            }
            ">
               {{res.module}}&nbsp;错词&nbsp;({{res.wrongWords.length}}个)
           </div>
           <div :class="$style.wordsBox" v-for="item in res.wrongWords">
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
        <div :class="$style.btn" @click="goResult">
           开始练习
        </div>
    </div>
</template>

<script>
    import apiCall from 'util/xhr'
    import {cache} from 'util/global'
    import {Indicator} from 'mint-ui';

    export default {
        data() {
            return {
                wrongWordList:[],
                moduleName:"module1",
            }
        },
        created() {
            Indicator.open();
            let {type = "", module = ""} = this.$route.query;
            apiCall.post("/TKT/moduleOrWrongWordOverview", {
                type,
                module
            }).then((data) => {
              this.wrongWordList = data.wrongWordList
                Indicator.close();
            });
        },
        mounted() {
//          this.$nextTick(()=>{
//
//          })
        },
        methods: {
            onScroll:function (e,position) {
                let module2Top = document.querySelector(".module2").offsetTop
                let module3Top = document.querySelector(".module3").offsetTop
                if (position.scrollTop >= module2Top) {
                   this.moduleName ="module2"
                }else if (position.scrollTop >= module3Top) {
                    this.moduleName ="module3"
                }else{
                    this.moduleName ="module1"
                }

            },
            goResult:function () {
                cache.remove("batchId");
                this.$router.push({path:"wrongResult"});
            }
        }
    }
</script>

<style lang="less" module>
    .wrapper{
        height: 100%;
        background: #EFEFF4;
        overflow-y: scroll;
        padding-top: 132px;
        padding-bottom: 200px;
    }
    .btn{
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
    .whiteBg {
        position: fixed;
        top:0;
        background: #fff !important;
        box-shadow: 0 12px 12px 0 rgba(166,166,166,0.12);
    }

    　.wrongWordList {
        .header {
            text-align: center;
            font-size: 32px;
            width: 750px;
            height: 112px;
            color: #5E3F8B;
            line-height: 112px;
            margin-bottom: 44px;
        }
    }

    .wordsBox{
        font-size: 32px;
        color: #8E8E93;
        margin-bottom: 24px;
        padding: 0 30px;
        .word{
            display: flex;
            align-items: center;
            >div{
                margin-right: 28px;
            }
            .name{
                color: #000;
            }
        }
        .tips{
            margin-top: 10px;
            display: flex;
            align-items: center;
            font-size: 28px;
        }
    }
</style>
