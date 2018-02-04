<template>
    <div :class="$style.wrongWapper" v-if="wrongWordList">
        <div :class="$style.wrapper" v-scroll="onScroll" v-if="wrongWordList.length!==0">
            <div :class="$style.wrongWordList" v-for="res in wrongWordList">
                <div :class="res.module">
                    <div :class="{
           [$style.header]:true,
           [$style.whiteBg]: res.module === moduleName
            }" v-if="res.wrongWords.length!==0">
                        {{res.module}}&nbsp;错词&nbsp;({{res.wrongWords.length}}个)
                    </div>
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
        <div v-else :class="$style.noWrongWord">
            <div :class="$style.emptyBg"></div>
            <div>没有错词了哦～</div>
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
                wrongWordList: "",
                moduleName: "",
                originModuleName: ""
            }
        },
        created() {
            Indicator.open();
            let {type = "", module = ""} = this.$route.query;
            apiCall.post("/tkt/moduleOrWrongWordOverview", {
                type,
                module: module
            }).then((data) => {
                this.wrongWordList = data.wrongWordList;
                for (let item of this.wrongWordList) {
                    if (item.wrongWords.length > 0) {
                        this.moduleName = item.module;
                        this.originModuleName = item.module;
                        break;
                    }
                }
                Indicator.close();
            });
        },
        mounted() {
//          this.$nextTick(()=>{
//
//          })
        },
        methods: {
            onScroll: function (e, position) {
                let module1Top, module2Top, module3Top;
                let module1, module2, module3;
                module1 = document.querySelector(".module1");
                module2 = document.querySelector(".module2");
                module3 = document.querySelector(".module3");

                let module = this.originModuleName.match(/\d+/g)[0];
                let originTop = document.querySelector(`.${this.originModuleName}`).offsetTop;
                if (module == 3) {
                    this.moduleName = this.originModuleName;
                } else if (module == 2) {

                    if (module3) {
                        module3Top = module3.offsetTop;
                        if (position.scrollTop >= module3Top) {
                            this.moduleName = "module3"
                        } else {
                            this.moduleName = this.originModuleName;
                        }
                    } else {
                        this.moduleName = this.originModuleName;
                    }


                } else if (module == 1) {

                    if (module2 && module3) {
                        module2Top = module2.offsetTop;
                        module3Top = module3.offsetTop;
                        if (position.scrollTop >= module2Top && position.scrollTop < module3Top) {
                            this.moduleName = "module2"
                        } else if (position.scrollTop >= module3Top) {
                            this.moduleName = "module3"
                        }
                        else {
                            this.moduleName = this.originModuleName;
                        }
                    } else if (module2) {
                        module2Top = module2.offsetTop;
                        if (position.scrollTop >= module2Top) {
                            this.moduleName = "module2"
                        } else {
                            this.moduleName = this.originModuleName;
                        }
                    } else if (module3) {
                        module3Top = module3.offsetTop;
                        if (position.scrollTop >= module3Top) {
                            this.moduleName = "module3"
                        }
                        else {
                            this.moduleName = this.originModuleName;
                        }
                    }

                }
            },
            goResult: function () {
                cache.remove("batchId");
                cache.remove("iscomplete");
                cache.remove("resultData");
                cache.remove("wrongList");
                let {type = "", module = ""} = this.$route.query;
                this.$router.push({
                    path: "wrongResult", query: {
                        praticType: type == 2 ? 2 : 3,
                        module: module
                    }
                });
            }
        }
    }
</script>

<style lang="less" module>
    .wrongWapper {
        height: 100%;
    }

    .wrapper {
        height: 100%;
        background: #EFEFF4;
        overflow-y: scroll;
        padding-top: 132px;
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

    .whiteBg {
        position: fixed;
        top: 0;
        background: #fff !important;
        box-shadow: 0 12px 12px 0 rgba(166, 166, 166, 0.12);
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

    .wordsBox {
        font-size: 32px;
        color: #8E8E93;
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

    .noWrongWord {
        height: 100%;
        display: flex;
        padding-top: 272px;
        align-items: center;
        font-size: 36px;
        color: #8E8E93;
        flex-direction: column;
        background: #EFEFF4;
        .emptyBg {
            background: url("../../img/noWrongBg.png");
            width: 220px;
            height: 234px;
            background-size: 100% 100%;
            margin-bottom: 26px;
        }
    }
</style>
