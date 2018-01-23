<template>
    <result :practicType="practicType" resultTitle="错题复习"></result>
</template>

<script>
    import result from '../result/index'

    export default {
        data() {
            return {
                practicType:2
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
