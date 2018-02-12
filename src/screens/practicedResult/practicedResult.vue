<template>
   <result :practicType="practicType" ></result>
</template>

<script lang="ts">
   import Vue from 'vue'
   import Component from 'vue-class-component'
   import result from '../result/result'
   @Component({
      components:{
            result
        }
   })
    export default class extends Vue {
         practicType:number =1 
    }
</script>

<style lang="less" module>

</style>
