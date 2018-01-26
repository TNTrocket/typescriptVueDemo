<template>
    <div :class="$style.wrapper" v-scroll="onScroll">
        <div :class="$style.practiced" v-if="practicedNumber!==0">
            <div :class="{
           [$style.header]:true,
           [$style.whiteBg]:!barFixed,
           [$style.fixed]:!barFixed
            }
            ">
                {{moduleName}}&nbsp;已练习&nbsp;({{practicedNumber}}/{{practicedNumber+ unpracticedNumber}})
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
            }">
                {{moduleName}}&nbsp;未练习&nbsp;({{unpracticedNumber}}/{{practicedNumber+ unpracticedNumber}})
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
            重练一次
        </div>
        <div :class="$style.btn" @click="goResult" v-else>
            {{btnTxt}}
        </div>
    </div>
</template>

<script>
    import apiCall from 'util/xhr'
    import {cache} from 'util/global'
    import {Indicator,MessageBox} from 'mint-ui';

    export default {
        data() {
            return {
                moduleName: "",
                practicedList: [],
                unpracticedList: [],
                barFixed: false,
                practicedNumber: 0,
                unpracticedNumber: 0,
                btnTxt:"开始练习"
            }
        },
        created() {
         this.init();
        },
        mounted() {
//          this.$nextTick(()=>{
//
//          })
        },
        methods: {
            init(){
                Indicator.open();
                let {type = "", module = ""} = this.$route.query;
                apiCall.post("/tkt/moduleOrWrongWordOverview", {
                    type,
                    module
                }).then((data) => {
                    this.practicedList= data.wordList.practiced || [];
                    this.unpracticedList =data.wordList.unpracticed || [];
                    this.practicedNumber = this.practicedList.length || 0;
                    this.unpracticedNumber = this.unpracticedList.length || 0;
                    if(this.practicedNumber ===0){
                        this.btnTxt ="开始练习"
                    }else if(this.unpracticedNumber!==0&& this.practicedNumber!==0){
                        this.btnTxt ="继续练习"
                    }
                    Indicator.close();
                });
                this.moduleName = module
            },
            onScroll:function (e,position) {
                let offsetTop = document.querySelector(`.${this.$style.unPracticed}`).offsetTop
                if (position.scrollTop >= offsetTop) {
                    this.barFixed = true
                } else {
                    this.barFixed = false
                }

            },
            goResult () {
                cache.remove("batchId");
                cache.remove("iscomplete");
                cache.remove("resultData");
                cache.remove("wrongList");
                this.$router.push({path:"practicedResult"});
            },
            modeAgain(){
                let { module = ""} = this.$route.query;
                apiCall.post("/tkt/replay",{
                    module:module
                }).then(() => {
                    Indicator.close();
                    MessageBox({
                        message:"已练习将会清空，错词本会保留。确定要重头再来吗？",
                        showConfirmButton: true,
                        showCancelButton:true,
                        title:"",
                        cancelButtonText:"取消",
                        confirmButtonText:"确定",
                        closeOnClickModal:false
                    }).then(action => {
                        if(action === "cancel"){

                        }else{
                            this.init();
                        }

                    });

                })
            }
        }
    }
</script>

<style lang="less" module>
    .wrapper{
        height: 100%;
        background: #EFEFF4;
        overflow-y: scroll;
        padding-top: 122px;
        padding-bottom: 200px;
    }
    .fixed{
        position: fixed;
        top:0;
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
        background: #fff !important;
        box-shadow: 0 12px 12px 0 rgba(166,166,166,0.12);
    }

    　.practiced {
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
    .unPracticed{
        .header{
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
