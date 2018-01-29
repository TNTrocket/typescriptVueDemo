<template>
    <div :class="$style.bothWapper">
        <div v-if="isNew==='Y'">
            <first></first>
        </div>
        <div :class="$style.indexWapper" v-else-if="isNew ==='N'">
            <div :class="$style.content">
                <div :class="$style.practice">
                    <div :class="$style.title">
                        <span :class="$style.icon"></span>
                        <span :class="$style.txt">已练习</span>
                        <span :class="$style.process">{{practicedNo}}/{{totalNo}}</span>
                    </div>
                    <div :class="$style.moduleList">
                        <ul>
                            <li v-for="(val,key) in practiced">
                                <div :class="$style.module">
                                    M
                                </div>
                                <div :class="$style.moduleTxt" @click="goPracticed(key)">
                                    <div>{{key}}</div>
                                    <div :class="$style.processTxt">{{val}}</div>
                                    <div :class="$style.indexArrow"></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div :class="$style.wrongWord" v-if="wrongWordNo > 0">
                    <div :class="$style.title">
                        <span :class="$style.icon"></span>
                        <span :class="$style.txt">错词本</span>
                        <span :class="$style.word" @click="gowrongTxt(1)">
                            <span>全部</span>
                            <span>{{wrongWordNo}}</span>
                            <span :class="$style.indexArrow"></span>
                        </span>
                    </div>
                    <div :class="$style.moduleList">
                        <ul>
                            <li v-for="(val,key) in wrongWordModules" @click="gowrongTxt(2,key)">
                                <div :class="$style.module">
                                    M
                                </div>
                                <div :class="$style.moduleTxt">
                                    <div>{{key}}</div>
                                    <div :class="$style.processTxt">{{val}}</div>
                                    <div :class="$style.indexArrow"></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div :class="$style.footer">
                <div v-if="isDone" :class="$style.done">
                    <div :class="$style.doneBg"></div>
                    <div :class="$style.doneTxt">
                        <span>恭喜！所有单词都背完啦！</span>
                        <span :class="$style.again">
                        <span @click="again">从头再来</span>
                        <span :class="$style.doneArrow"></span>
                    </span>
                    </div>
                </div>
                <div v-else :class="$style.btn" @click="startRecite">
                    开始背单词
                </div>
            </div>
        </div>
        <div v-else>
            <toast></toast>
        </div>
    </div>
</template>

<script>
    import apiCall from 'util/xhr'
    import first from "./first.vue"
    import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
    import {cache} from 'util/global'
    import {Indicator, MessageBox} from 'mint-ui';
    import toast from 'components/toast/Toast';

    export default {
        data() {
            return {
                isDone: false,
                practicedNo: 0,
                totalNo: 0,
                practiced: {},
                wrongWordModules: {},
                wrongWordNo: 0
            }
        },
        created() {

        },
        mounted() {
            this.changeStatus({});
            if (this.isNew === "Y") {

            } else if (this.isNew === "N") {
                Indicator.open();
                apiCall.post("/tkt/getTKTOverview").then((data) => {
                    this.practicedNo = data.practicedNo;
                    this.totalNo = data.totalNo;
                    this.practiced = data.practiced;
                    this.wrongWordModules = data.wrongWordModules;
                    this.wrongWordNo = data.wrongWordNo;
                    this.isDone = this.practicedNo === this.totalNo & this.totalNo != 0;
                    cache.set("totalNo", this.totalNo);
                    cache.set("practicedNo", this.practicedNo);
                    cache.set("wrongWordNo", this.wrongWordNo);
                    Indicator.close();
                },()=>{

                })
            }
        },
        components: {
            first,
            toast
        },
        methods: {
            startRecite() {
                cache.remove("isReciteComplete");
                this.$router.push({path: "recite"})
            },
            goPracticed(module) {
                let moduleId = module.match(/\d+/g);
                console.log(moduleId);
                this.$router.push({
                    path: "practiced", query: {
                        type: 0,
                        module: moduleId[0]
                    }
                })
            },
            gowrongTxt(type, module) {
                let moduleId =[];
                if(module) {
                     moduleId = module.match(/\d+/g);
                }
                console.log(moduleId);
                this.$router.push({
                    path: "wrongTxt", query: {
                        type,
                        module: moduleId[0] ? moduleId[0] : ""
                    }
                })
            },
            again() {
                Indicator.open();
                apiCall.post("/tkt/replay").then(() => {
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
                            cache.set("isNew", "Y");
                            this.changeStatus({isNew: "Y"});
                        }

                    });

                })
            },
            ...mapActions({
                changeStatus: "changeIsNew"
            })

        },
        computed: {
            ...mapState({
                isNew: state => {
                    return state.user.isNew
                }
            }),
        },
    }
</script>

<style lang="less" module>
    .bothWapper {
        height: 100%;
    }

    .indexWapper {
        height: 100%;
        background: #EFEFF4;
        overflow-y: scroll;
        .content {
            padding: 0 30px;
        }
        .footer {
            position: fixed;
            width: 750px;
            height: 300px;
            background: #fff;
            z-index: 999;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            .done {
                font-size: 32px;
                color: #8E8E93;
                display: flex;
                flex-direction: column;
                align-items: center;
                .doneBg {
                    background-image: url("../../img/indexDone.png");
                    background-size: 100% 100%;
                    width: 242px;
                    height: 176px;
                }
                .doneTxt {
                    margin-top: 24px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    .again {
                        color: #5E3F8B;
                        display: flex;
                        align-items: center;
                        .doneArrow {
                            background: url("../../img/indexDoneArrow.png");
                            width: 16px;
                            height: 28px;
                            margin-left: 10px;
                            background-size: 100% 100%;
                        }
                    }
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
            }
        }
        .title {
            font-size: 32px;
            display: flex;
            > span {
                margin-right: 24px;
            }
            .icon {
                width: 44px;
                height: 48px;
            }
            .process {
                color: #5E3F8B;
            }
            .word {
                display: flex;
                color: #5E3F8B;
                align-items: center;
                justify-content: space-between;
                > span {
                    margin-right: 10px;
                }
            }
        }
        .moduleList {
            font-size: 32px;
            margin-top: 32px;
            ul {
                list-style: none;
                li {
                    &:first-child {
                        .moduleTxt {
                            border-top: 1px solid #D1D1D6; /*no*/
                        }
                    }
                    display: flex;
                    padding-left: 66px;
                    align-items: center;
                    height: 100%;
                    .module {
                        flex: none;
                        border-radius: 50%;
                        width: 72px;
                        height: 72px;
                        line-height: 72px;
                        background: #ffffff;
                        text-align: center;
                        color: #5E3F8B;
                    }
                    .moduleTxt {
                        font-size: 28px;
                        padding: 32px 0;
                        flex: 1;
                        margin-left: 52px;
                        display: flex;
                        line-height: 1;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid #D1D1D6; /*no*/
                        .processTxt {
                            color: #5E3F8B;
                        }
                        > div {
                            flex: 1;
                        }
                        .indexArrow {
                            flex: none;
                        }
                    }
                }
            }

        }
        .indexArrow {
            background-image: url("../../img/indexArrow.png");
            background-size: 100% 100%;
            width: 16px;
            height: 28px;
            display: inline-block;
        }
        .practice {
            padding-top: 50px;
            .icon {
                background-image: url("../../img/traningIcon.png");
                background-size: 100% 100%;
            }
        }
        .wrongWord {
            padding-top: 50px;
            .icon {
                background-image: url("../../img/wrongIcon.png");
                background-size: 100% 100%;
            }
        }
    }
</style>
