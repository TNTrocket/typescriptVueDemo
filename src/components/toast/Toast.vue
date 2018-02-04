<template>
    <div>
        <div :class="$style.spinner" v-show="showToast">
            <div :class="$style.bounce1"></div>
            <div :class="$style.bounce2"></div>
            <div :class="$style.bounce3"></div>
        </div>
    </div>
</template>

<style lang="less" module>
    .spinner {
        margin: 0 auto;
        padding-top: 300px;
        width: 300px;
        text-align: center;
    }

    .spinner > div {
        width: 60px;
        height: 60px;
        background-color: #000;

        border-radius: 100%;
        display: inline-block;
        -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
        animation: bouncedelay 1.4s infinite ease-in-out;
        /* Prevent first frame from flickering when animation starts */
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }

    .spinner .bounce1 {
        -webkit-animation-delay: -0.32s;
        animation-delay: -0.32s;
    }

    .spinner .bounce2 {
        -webkit-animation-delay: -0.16s;
        animation-delay: -0.16s;
    }

    @-webkit-keyframes bouncedelay {
        0%, 80%, 100% {
            -webkit-transform: scale(0.0)
        }
        40% {
            -webkit-transform: scale(1.0)
        }
    }

    @keyframes bouncedelay {
        0%, 80%, 100% {
            transform: scale(0.0);
            -webkit-transform: scale(0.0);
        }
        40% {
            transform: scale(1.0);
            -webkit-transform: scale(1.0);
        }
    }
</style>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import { Getter, Action, State } from 'vuex-class'

    @Component({
        props: {
            showToast: {
                type: Boolean,
                default: true
            }

        }
    })

    export default class Toast extends Vue{
//        data() {
//            return {}
//        },

        mounted() {

        }
//        methods: {}
    }
</script>
