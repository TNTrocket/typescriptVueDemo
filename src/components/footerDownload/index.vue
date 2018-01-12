<template>
    <div>
        <div :class="$style.footer">
            <div :class="$style.logo">
                <img src="./logo@2x.png"/>
            </div>
            <div :class="$style.txtBox">
                <p :class="$style.txtTitle">欲知答案如何</p>
                <p :class="$style.txtTips">打开"伴你考教师"</p>
            </div>
            <div :class="$style.download">
                立即下载
            </div>
        </div>
    </div>
</template>

<script>

</script>

<style lang="less" module>
    .footer {
        box-shadow: 0 -2px 4px 0 rgba(50,55,68,0.15);
        position: fixed;
        width: 100%;
        height: 140px;
        bottom: 0;
        padding: 0 36px;
        font-size: 28px;
        display: flex;
        z-index: 999;
        background: #fff;
        align-items: center;
        .logo {
            img {
                width: 84px;
                height: 84px;
            }
        }
        .txtBox {
            margin-left: 28px;
        }
        .download {
            font-size: 38px;
            margin-left: 140px;
            width: 220px;
            height: 84px;
            line-height: 84px;
            background: #0076FF;
            border-radius: 50px;
            text-align: center;
            color: #fff;
            font-weight: lighter;
        }
        .txtTitle{
            font-size: 36px;
            color: #323744;
        }
        .txtTips{
            color: #7D879B;
        }
    }
</style>
