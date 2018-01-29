<template>
    <result  resultTitle="错题复习" :isPropsNeedDelete="isNeedDelete"
            resultMode="wrongTxt"
    ></result>
</template>

<script>
    import result from './showResult'

    export default {
        data() {
            return {
                practicType:2,
                isNeedDelete:true
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
