<template>
    <div :class="$style.Rwapper">
        <answer :word="wrongWord" title="错词复习"  :wordType="0"
                :noKnowBtn="true" v-if="wrongWord.length!==0 && !isReciteComplete" :isFinish="isFinish"></answer>
        <div v-else-if="isReciteComplete || newWord.length > 0">
            <div :class="$style.review" v-show="wrongWord.length!==0">
                <div>
                    <p>复习完成！</p>
                    <p>开始背新单词。</p>
                </div>
                <div :class="$style.whiteArrow"></div>
            </div>
            <div :class="$style.moduleBox">
                <div :class="$style.header">
                    <div :class="$style.title">本次目标</div>
                    <div :class="$style.moduleTxt">
                        <p v-for="(val,key) in module">
                            {{key}}&nbsp;--&nbsp;{{val}}个
                        </p>
                    </div>
                </div>
                <div :class="$style.wordsBox" v-for="item in newWord">
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
            <div :class="$style.startTraning" @click="startTraning">开始练习</div>
        </div>
        <div v-else-if="!isReciteComplete ">
            <toast></toast>
        </div>
    </div>
</template>

<script>
    import apiCall from 'util/xhr'
    import answer from 'components/answer/index'
    import toast from 'components/toast/Toast'
    import {cache} from 'util/global'
    import {Indicator} from 'mint-ui';

    export default {
        data() {
            return {
                wrongWord: [],
                newWord: [],
                module: {},
                isReciteComplete: false
            }
        },
        created() {


        },
        mounted() {
            this.isReciteComplete = cache.get("isReciteComplete") || false;
//            let batchId = cache.get("batchId") || "";
            Indicator.open();
            apiCall.post("/tkt/answerList", {
                praticType: 0,
//                batchId: batchId
            }).then((data) => {
                Indicator.close();
                cache.set("batchId", data.batchId);
                for (let item of data.answerlist) {
                    if (item.type == 1) {
                        let temp ={};
                        item.answers.forEach((res,index)=>{
                            if(temp[res.module]){
                                temp[res.module]++;
                            }else{
                                temp[res.module]=1;
                            }
                            for(let options of res.options){
                                if(res.currectOption ===options.option){
                                    item.answers[index].meaning = options.meaning
                                }
                            }
                        });
                        this.newWord = item.answers;
                        this.module = temp
                    } else if (item.type == 0) {
                        this.wrongWord = item.answers;
                    }
                }
            })
        },

        updated() {

        },
        components: {
            answer,
            toast
        },
        methods: {
            isFinish() {
                let isReciteComplete = cache.get("isReciteComplete") || true;
                if (!cache.get("isReciteComplete")) {
                    cache.set("isReciteComplete", true);
                }
                this.isReciteComplete = isReciteComplete
            },
            startTraning(){
//                cache.remove("batchId");
                cache.remove("iscomplete");
                cache.remove("resultData");
                cache.remove("wrongList");

                this.$router.push({path:"result"})
            }
        }
    }
</script>

<style lang="less" module>
    .Rwapper {
        height: 100%;
        background: #EFEFF4;
        overflow-y: scroll;
        padding-bottom: 200px;
    }

    .review {
        font-size: 40px;
        color: #5E3F8B;
        width: 750px;
        height: 240px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        text-align: center;
        position: relative;
        .whiteArrow {
            position: absolute;
            background: url("../../img/whiteArrow.png");
            width: 32px;
            height: 32px;
            bottom: -32px;
            background-size: contain;
            left: 80px;
        }
    }

    .moduleBox {
        margin-top: 44px;
        padding: 0 30px;
        .header {
            >div{
                display: inline-block;
               vertical-align: text-top;
            }
            .title {
                font-size: 32px;
            }
            .moduleTxt{
                margin-left: 14px;
                font-size: 32px;
                color: #5E3F8B;
            }
        }
    }
    .wordsBox{
        font-size: 32px;
        color: #8E8E93;
        margin-bottom: 24px;
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
    .startTraning{
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
</style>
