<template>
    <div>
        <div :class="$style.header">
            <p>欢迎进入TKT单词通关</p>
            <p>老师们搜罗了历年TKT考试真题词汇</p>
            <p>一共约400个</p>
            <p :class="$style.tips">掌握这些词汇对TKT考试至关重要</p>
            <p>点击开始吧</p>
            <img :class="$style.icon" src="../../img/firstArrow.png"/>
        </div>
        <div :class="$style.btn" @click="startRecite">
            开始背单词
        </div>
    </div>
</template>

<script lang="ts">
    import apiCall from 'util/xhr'
    import {cache} from 'util/global'
    import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import { Getter, Action } from 'vuex-class'
    @Component
    export default class First extends Vue {
        @Action("changeIsNew") changeStatus: Function;
//        data() {
//            return {
//                targetUrl: ""
//            }
//        },
        created() {

        }
        mounted() {

        }
//        methods: {
            startRecite() {
                cache.set("isNew","N");
                this.changeStatus({isNew:"N"});
                cache.remove("isReciteComplete");
                this.$router.push({path: "recite"});
            }
//            ...mapActions({
//                changeStatus: "changeIsNew"
//            })
//        }
    }
</script>

<style lang="less" module>
    .header {
        width: 750px;
        height: 792px;
        background-image: url("../../img/firstBg.png");
        background-size: 100% 100%;
        font-size: 36px;
        text-align: center;
        padding-top: 174px;
        color: #FFE034;
        letter-spacing: -0.11px;
        line-height: 64px;
        text-shadow: 0 4px 8px #512992;
        .tips {
            margin-top: 62px;
        }
        .icon {
            width: 32px;
            height: 32px;
            display: inline-block;
        }
    }

    .btn {
        margin: 106px auto 0 auto;
        background: #FFE034;
        box-shadow: 0 4px 10px 0 rgba(255, 224, 52, 0.65);
        border-radius: 80px;
        width: 560px;
        height: 140px;
        font-size: 40px;
        color: #5E3F8B;
        text-align: center;
        line-height: 140px;
    }
</style>
