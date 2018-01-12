<template>
    <div>
        <shareNews></shareNews>
        <footerDownload></footerDownload>
    </div>
</template>

<script>
    import shareNews from '../news/news'
    import footerDownload from 'components/footerDownload/index'

    export default {
        data() {
            return {
                title: "",
                source: "",
                publishTime: "",
                article: ""
            }
        },
        components: {
            shareNews: shareNews,
            footerDownload: footerDownload
        }
    }
</script>

<style lang="less" module>

</style>
