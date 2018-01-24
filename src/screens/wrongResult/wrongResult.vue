<template>
    <result :practicType="practicType" resultTitle="错题复习" :isNeedDelete="isNeedDelete"></result>
</template>

<script>
    import result from '../result/index'

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
