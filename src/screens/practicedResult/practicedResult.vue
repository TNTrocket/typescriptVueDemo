<template>
   <result :practicType="practicType" resultMode="practiced"></result>
</template>

<script>
   import result from '../result/result'

    export default {
        data() {
            return {
                practicType:1
            }
        },
        created() {
        },
        mounted() {

        },
        methods: {

        },
        components:{
            result
        }
    }
</script>

<style lang="less" module>

</style>
