<template>
    <router-view></router-view>
</template>

<script>
    import Vue from 'vue'
    import Component from 'vue-class-component'

    @Component
    export default class App extends Vue {
    }
</script>

<style lang="less" moudle>
  @import "./common";
</style>
